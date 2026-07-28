import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Support
            </a>
          </div>

          
          <div className="text-center sm:text-right">
            <span className="text-lg font-bold text-white tracking-tight">
              LewaHub
            </span>
          </div>
        </div>

        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; 2026 LewaHub School Catalog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;