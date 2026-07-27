const Footer = () => {
  return (
    <footer className="w-full bottom-0 bg-surface-container-lowest border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-xl py-lg max-w-container-max mx-auto">
        <div className="mb-sm md:mb-0">
          <div className="text-headline-md font-headline-md text-on-surface-variant font-bold mb-xs">
            LewaHub
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant/80 max-w-xs text-center md:text-left">
            Your reliable guide to educational institutions in Cameroon.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-sm">
          <div className="flex gap-md">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm" href="#">
              Privacy Policy
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm" href="#">
              Terms of Service
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm" href="#">
              Support
            </a>
          </div>
          <div className="font-body-md text-body-md text-on-surface-variant/60 font-label-sm">
            © 2026 LewaHub School Catalog. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;