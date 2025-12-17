import { ChefHat, User, LogOut, Home, BookOpen } from 'lucide-react';

interface HeaderProps {
  user: { id: string; email: string; name: string } | null;
  currentPage: 'welcome' | 'recipes';
  onNavigate: (page: 'welcome' | 'recipes') => void;
  onAuthClick: () => void;
  onSignOut: () => void;
}

export function Header({ user, currentPage, onNavigate, onAuthClick, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl text-gray-900 hidden sm:inline">RecipeHub</span>
          </button>

          <nav className="flex items-center gap-1 sm:gap-4 md:gap-6">
            {user && (
              <>
                <button
                  onClick={() => onNavigate('welcome')}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                    currentPage === 'welcome'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={() => onNavigate('recipes')}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                    currentPage === 'recipes'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Rezepte</span>
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-1 sm:gap-4">
                <div className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 hidden md:inline">{user.name}</span>
                  <span className="text-gray-700 md:hidden">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Abmelden"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Abmelden</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm sm:text-base"
              >
                Anmelden
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}