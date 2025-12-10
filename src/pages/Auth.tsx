import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, UserPlus, Loader2, KeyRound, ArrowLeft } from 'lucide-react';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const emailSchema = z.object({
  email: z.string().trim().email({ message: 'Email inválido' }),
});

type AuthMode = 'login' | 'signup' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    if (mode === 'reset') {
      const result = emailSchema.safeParse({ email });
      if (!result.success) {
        setErrors({ email: result.error.errors[0]?.message });
        return false;
      }
      setErrors({});
      return true;
    }

    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handlePasswordReset = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setMode('login');
      }
    } catch (err) {
      toast.error('Ocorreu um erro ao enviar o email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'reset') {
      await handlePasswordReset();
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/', { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName || email.split('@')[0],
            },
          },
        });
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Conta criada com sucesso!');
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      toast.error('Ocorreu um erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Entrar';
      case 'signup': return 'Criar Conta';
      case 'reset': return 'Recuperar Senha';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Entre com suas credenciais para acessar o dashboard';
      case 'signup': return 'Crie uma conta para começar a usar o dashboard';
      case 'reset': return 'Informe seu email para receber o link de recuperação';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="/logo-fortlar.png" 
            alt="Fortlar" 
            className="h-20 mx-auto mb-6"
          />
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nome de exibição</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Seu nome"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : mode === 'login' ? (
                <LogIn className="h-4 w-4 mr-2" />
              ) : mode === 'signup' ? (
                <UserPlus className="h-4 w-4 mr-2" />
              ) : (
                <KeyRound className="h-4 w-4 mr-2" />
              )}
              {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar Conta' : 'Enviar Email'}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2 text-center">
            {mode === 'reset' ? (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 w-full"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-3 w-3" />
                Voltar para o login
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
                  disabled={isSubmitting}
                >
                  {mode === 'login' ? 'Não tem conta? Criar conta' : 'Já tem conta? Fazer login'}
                </button>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
                    disabled={isSubmitting}
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
