import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import pmzLogo from "@/assets/pmz-logo.webp";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={pmzLogo} alt="PMZ Peças e Pneus" className="h-9 w-auto rounded-lg" />
          <span className="text-lg font-display font-bold tracking-tight text-foreground">
            PIXEL <span className="text-gradient-forge">FORGE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Planos
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <button className="inline-flex items-center justify-center h-10 px-5 rounded-lg text-sm font-medium border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all">
              Entrar
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="inline-flex items-center justify-center h-10 px-5 rounded-lg text-sm font-semibold bg-forge-gradient text-primary-foreground glow-forge hover:brightness-110 transition-all">
              Começar Grátis
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
