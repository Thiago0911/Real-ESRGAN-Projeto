import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import pmzLogo from "@/assets/pmz-logo.webp";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto flex h-16 items-center px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <img
              src={pmzLogo}
              alt="PMZ Peças e Pneus"
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="text-lg font-display font-bold tracking-tight text-foreground">
            PIXEL <span className="text-gradient-forge">FORGE</span>
          </span>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;