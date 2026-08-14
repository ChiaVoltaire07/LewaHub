import { Search, Info, Mail } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary-700 tracking-tight">
              LewaHub
            </span>
          </div>

          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <a
              href="#"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;