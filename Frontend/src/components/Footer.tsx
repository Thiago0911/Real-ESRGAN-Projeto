import { Flame } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forge-gradient">
              <Flame className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold tracking-tight">
              PIXEL <span className="text-gradient-forge">FORGE</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Pixel Forge. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
