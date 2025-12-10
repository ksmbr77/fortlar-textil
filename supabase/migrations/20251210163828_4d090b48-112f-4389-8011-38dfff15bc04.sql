-- Tabela para armazenar configurações do dashboard (vendas, metas, etc.)
CREATE TABLE public.dashboard_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para histórico de metas
CREATE TABLE public.goals_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    month TEXT NOT NULL UNIQUE,
    meta NUMERIC NOT NULL DEFAULT 0,
    atingido NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS mas permitir acesso público (dados compartilhados entre vendedores)
ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals_history ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura e escrita (dados compartilhados)
CREATE POLICY "Allow public read access" ON public.dashboard_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.dashboard_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.dashboard_settings FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.goals_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.goals_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.goals_history FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.goals_history FOR DELETE USING (true);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar timestamps
CREATE TRIGGER update_dashboard_settings_updated_at
BEFORE UPDATE ON public.dashboard_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_history_updated_at
BEFORE UPDATE ON public.goals_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para sincronização instantânea
ALTER PUBLICATION supabase_realtime ADD TABLE public.dashboard_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals_history;