import { Package2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Package2 className="h-6 w-6" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Acme Inc
            </a>
            . The source code is available on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <nav className="flex gap-4">
          <NavLink to="/" className="text-sm underline-offset-4 hover:underline">
            Home
          </NavLink>
          <NavLink to="/about" className="text-sm underline-offset-4 hover:underline">
            About
          </NavLink>
          <a href="#" className="text-sm underline-offset-4 hover:underline">
            Twitter
          </a>
          <a href="#" className="text-sm underline-offset-4 hover:underline">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;