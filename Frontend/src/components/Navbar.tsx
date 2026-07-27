import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 bg-surface transition-shadow ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-xl max-w-container-max mx-auto py-sm">
        <div className="text-headline-lg font-headline-lg text-primary tracking-tight">
          LewaHub
        </div>
        
        <div className="hidden md:flex items-center gap-md">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="#">
            Home
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="#">
            Search
          </a>
          <a className="text-primary border-b-2 border-primary font-bold pb-1 font-label-md" href="#">
            About
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="#">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-sm">
         
          <button className="md:hidden text-primary">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;