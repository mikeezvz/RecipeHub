import { ChefHat, Book, Search, Tags, Heart } from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-8 shadow-xl">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Willkommen bei RecipeHub
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Entdecke, erstelle und teile deine Lieblingsrezepte. 
            Organisiere deine kulinarische Reise mit Tags, Filtern und detaillierten Nährwertangaben.
          </p>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <span>Jetzt starten</span>
            <ChefHat className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">
            Alles, was du für deine Rezepte brauchst
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl mb-4">
                <Book className="w-7 h-7 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">CRUD Operationen</h3>
              <p className="text-gray-600">
                Erstelle, bearbeite und verwalte deine Rezepte einfach und intuitiv
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl mb-4">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">Suche & Filter</h3>
              <p className="text-gray-600">
                Finde deine Rezepte schnell mit leistungsstarken Such- und Filterfunktionen
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl mb-4">
                <Tags className="w-7 h-7 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">Tag-System</h3>
              <p className="text-gray-600">
                Organisiere Rezepte mit individuellen Tags wie "Vegan", "Schnell", "Gesund"
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl mb-4">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="mb-2 text-gray-900">Nährwerte</h3>
              <p className="text-gray-600">
                Behalte den Überblick mit detaillierten Kalorienangaben für jedes Rezept
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
