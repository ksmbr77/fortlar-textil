import { Bell, Lightbulb, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const notifications = [
  {
    id: 1,
    type: "welcome",
    icon: Sparkles,
    title: "Bem-vindo, Fortlar!",
    message: "Bom dia! A Fortlar Têxtil está crescendo. Continue assim! 🌟",
    time: "Agora",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    type: "tip",
    icon: Lightbulb,
    title: "Dica do dia",
    message: "Fotos de qualidade aumentam suas vendas em até 35% na Shopee!",
    time: "5 min",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 3,
    type: "motivation",
    icon: Rocket,
    title: "Você está voando!",
    message: "Novembro foi incrível com R$38k! Dezembro vai ser ainda melhor! 💪",
    time: "30 min",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notificações</h3>
          <p className="text-sm text-muted-foreground">
            {notifications.length} novas mensagens
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className="p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${notification.bgColor} shrink-0`}>
                    <IconComponent className={`w-4 h-4 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground truncate">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {notification.time}
                      </span>
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
