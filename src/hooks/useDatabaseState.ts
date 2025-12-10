import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export function useDatabaseState<T>(
  settingKey: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do banco
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('dashboard_settings')
          .select('setting_value')
          .eq('setting_key', settingKey)
          .maybeSingle();

        if (error) {
          console.error('Error loading data:', error);
        } else if (data) {
          setValue(data.setting_value as T);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Escutar mudanças em tempo real
    const channel = supabase
      .channel(`settings-${settingKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_settings',
          filter: `setting_key=eq.${settingKey}`
        },
        (payload) => {
          if (payload.new && 'setting_value' in payload.new) {
            setValue(payload.new.setting_value as T);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [settingKey]);

  // Salvar dados no banco
  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolvedValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue;

      // Salvar no banco de dados
      const saveData = async () => {
        try {
          const jsonValue = resolvedValue as unknown as Json;
          
          // Primeiro tenta atualizar
          const { data: existing } = await supabase
            .from('dashboard_settings')
            .select('id')
            .eq('setting_key', settingKey)
            .maybeSingle();

          if (existing) {
            await supabase
              .from('dashboard_settings')
              .update({ setting_value: jsonValue })
              .eq('setting_key', settingKey);
          } else {
            await supabase
              .from('dashboard_settings')
              .insert({ 
                setting_key: settingKey, 
                setting_value: jsonValue 
              });
          }
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };

      saveData();
      return resolvedValue;
    });
  }, [settingKey]);

  return [value, updateValue, isLoading];
}

// Hook específico para histórico de metas
export function useGoalsHistory() {
  const [historico, setHistorico] = useState<Array<{
    mes: string;
    meta: number;
    atingido: number;
    percentual: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('goals_history')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading goals history:', error);
        } else if (data && data.length > 0) {
          setHistorico(data.map(item => ({
            mes: item.month,
            meta: Number(item.meta),
            atingido: Number(item.atingido),
            percentual: item.meta > 0 ? (Number(item.atingido) / Number(item.meta)) * 100 : 0
          })));
        }
      } catch (error) {
        console.error('Error loading goals history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Escutar mudanças em tempo real
    const channel = supabase
      .channel('goals-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals_history'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateHistorico = useCallback(async (newHistorico: Array<{
    mes: string;
    meta: number;
    atingido: number;
    percentual: number;
  }>) => {
    setHistorico(newHistorico);

    // Atualizar cada item no banco
    for (const item of newHistorico) {
      try {
        // Primeiro tenta atualizar
        const { data: existing } = await supabase
          .from('goals_history')
          .select('id')
          .eq('month', item.mes)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('goals_history')
            .update({ meta: item.meta, atingido: item.atingido })
            .eq('month', item.mes);
        } else {
          await supabase
            .from('goals_history')
            .insert({ 
              month: item.mes, 
              meta: item.meta, 
              atingido: item.atingido 
            });
        }
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  }, []);

  return { historico, setHistorico: updateHistorico, isLoading };
}
