import { Bell, Lightbulb, Target, TrendingUp, Star, Heart, Award, Gift, Sun, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";

// Pool de notificações por categoria
const welcomeMessages = [
  { title: "Bom dia, Fortlar!", message: "Que hoje seja um dia de muitas vendas e conquistas!" },
  { title: "Olá, Campeão!", message: "Mais um dia para brilhar na Shopee. Vamos nessa!" },
  { title: "Seja bem-vindo!", message: "A Fortlar Têxtil está pronta para mais um dia de sucesso!" },
  { title: "Bom dia, Vendedor!", message: "Cada dia é uma nova oportunidade de superar suas metas!" },
  { title: "Olá, Fortlar!", message: "Prepare-se para decolar nas vendas hoje!" },
  { title: "Bem-vindo de volta!", message: "Sua dedicação está fazendo a diferença!" },
  { title: "Bom dia, Sucesso!", message: "Hoje é dia de bater recordes. Vamos lá!" },
];

const tipMessages = [
  { title: "Dica de Ouro", message: "Responda os clientes em até 5 minutos e aumente suas conversões em 40%!" },
  { title: "Segredo do Sucesso", message: "Fotos com fundo branco vendem até 35% mais na Shopee!" },
  { title: "Estratégia Vencedora", message: "Produtos com 5+ fotos têm 2x mais chances de venda!" },
  { title: "Truque de Mestre", message: "Use palavras-chave no título para aparecer mais nas buscas!" },
  { title: "Dica Premium", message: "Ofertas relâmpago geram até 5x mais visibilidade!" },
  { title: "Hack de Vendas", message: "Frete grátis acima de R$50 aumenta o ticket médio em 25%!" },
  { title: "Insight Valioso", message: "Clientes que deixam avaliação têm 70% mais chance de recomprar!" },
  { title: "Dica do Expert", message: "Atualize seus anúncios semanalmente para melhor ranqueamento!" },
  { title: "Segredo Revelado", message: "Vídeos curtos nos produtos aumentam vendas em até 50%!" },
  { title: "Tática Infalível", message: "Cupons de desconto para primeira compra fidelizam clientes!" },
];

const motivationMessages = [
  { title: "Você é Incrível!", message: "Cada venda é um passo rumo ao seu objetivo. Continue firme!" },
  { title: "Rumo ao Topo!", message: "Grandes conquistas começam com pequenos passos diários!" },
  { title: "Você Consegue!", message: "Sua meta está mais perto do que você imagina. Acredite!" },
  { title: "Campeão em Ação!", message: "Os melhores vendedores são os que nunca desistem!" },
  { title: "Energia Total!", message: "Transforme cada desafio em uma oportunidade de crescer!" },
  { title: "Foco no Objetivo!", message: "Persistência é a chave. Você está no caminho certo!" },
  { title: "Brilhe Hoje!", message: "Seu potencial é ilimitado. Mostre do que é capaz!" },
  { title: "Sucesso Garantido!", message: "Quem trabalha com paixão sempre colhe resultados!" },
  { title: "Vai com Tudo!", message: "Hoje é seu dia de fazer história nas vendas!" },
  { title: "Você é Top!", message: "Os números não mentem: você está evoluindo a cada dia!" },
];

const celebrationMessages = [
  { title: "Parabéns! 🏅", message: "Suas vendas estão crescendo! Continue nesse ritmo!" },
  { title: "Que Orgulho!", message: "A Fortlar Têxtil está fazendo história na Shopee!" },
  { title: "Conquista Desbloqueada!", message: "Você está superando as expectativas. Incrível!" },
  { title: "Recorde à Vista!", message: "Seu desempenho está melhor a cada mês!" },
  { title: "Sucesso Total!", message: "Você está provando que dedicação traz resultados!" },
];

// Função para obter seed baseada na data (muda a cada dia)
const getDailySeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

// Função para selecionar item aleatório baseado em seed
const seededRandom = (seed: number, index: number) => {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
};

const getRandomItem = <T,>(array: T[], seed: number, offset: number): T => {
  const index = Math.floor(seededRandom(seed, offset) * array.length);
  return array[index];
};

// Ícones disponíveis por tipo
const iconsByType = {
  welcome: [Sun, Coffee, Star, Heart],
  tip: [Lightbulb, Target, TrendingUp, Star],
  motivation: [Heart, Award, Target, TrendingUp],
  celebration: [Gift, Star, Award, TrendingUp],
};

const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export function NotificationsPopover() {
  const seed = getDailySeed();
  
  const [readNotifications, setReadNotifications] = usePersistentState<number[]>(`notifications-read-${seed}`, []);

  const notifications = useMemo(() => {
    const greeting = getGreetingTime();
    
    // Seleciona mensagens diferentes baseadas na data
    const welcomeMsg = getRandomItem(welcomeMessages, seed, 1);
    const tipMsg = getRandomItem(tipMessages, seed, 2);
    const motivationMsg = getRandomItem(motivationMessages, seed, 3);
    const celebrationMsg = getRandomItem(celebrationMessages, seed, 4);
    
    // Seleciona ícones baseados na data
    const welcomeIcon = getRandomItem(iconsByType.welcome, seed, 5);
    const tipIcon = getRandomItem(iconsByType.tip, seed, 6);
    const motivationIcon = getRandomItem(iconsByType.motivation, seed, 7);
    const celebrationIcon = getRandomItem(iconsByType.celebration, seed, 8);
    
    return [
      {
        id: 1,
        type: "welcome",
        icon: welcomeIcon,
        title: welcomeMsg.title.replace("Bom dia", greeting),
        message: welcomeMsg.message,
        time: "Agora",
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        id: 2,
        type: "tip",
        icon: tipIcon,
        title: tipMsg.title,
        message: tipMsg.message,
        time: "5 min",
        color: "text-warning",
        bgColor: "bg-warning/10",
      },
      {
        id: 3,
        type: "motivation",
        icon: motivationIcon,
        title: motivationMsg.title,
        message: motivationMsg.message,
        time: "30 min",
        color: "text-success",
        bgColor: "bg-success/10",
      },
      {
        id: 4,
        type: "celebration",
        icon: celebrationIcon,
        title: celebrationMsg.title,
        message: celebrationMsg.message,
        time: "1h",
        color: "text-accent",
        bgColor: "bg-accent/10",
      },
    ];
  }, [seed]);

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;

  const markAsRead = (id: number) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications([...readNotifications, id]);
    }
  };

  const markAllAsRead = () => {
    setReadNotifications(notifications.map(n => n.id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Notificações</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary hover:text-primary/80"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            const isRead = readNotifications.includes(notification.id);
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer ${isRead ? 'opacity-60' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${notification.bgColor} shrink-0`}>
                    <IconComponent className={`w-4 h-4 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-medium text-sm text-foreground truncate ${!isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
