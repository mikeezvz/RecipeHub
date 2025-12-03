import { ChefHat, User, LogOut } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-gray-900">RecipeHub</span>
          </button>

          <nav className="flex items-center gap-6">
            {user && (
              <>
                <button
                  onClick={() => onNavigate('welcome')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'welcome'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('recipes')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'recipes'
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rezepte
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Abmelden</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-shadow"
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
