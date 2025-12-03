import { useState, useMemo } from 'react';
import { Plus, Search, X, Flame } from 'lucide-react';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../App';

interface RecipeListProps {
  recipes: Recipe[];
  onCreateNew: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeList({ recipes, onCreateNew, onEdit, onDelete }: RecipeListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from recipes
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  // Filter recipes based on search and tags
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search filter
      const matchesSearch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => recipe.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [recipes, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl text-gray-900 mb-2">Meine Rezepte</h1>
          <p className="text-gray-600">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Rezept' : 'Rezepte'} gefunden
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Neues Rezept</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rezepte durchsuchen..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-700">Filter nach Tags:</span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Alle zurücksetzen
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl text-gray-700 mb-2">Keine Rezepte gefunden</h3>
          <p className="text-gray-500 mb-6">
            {recipes.length === 0
              ? 'Erstelle dein erstes Rezept, um loszulegen!'
              : 'Versuche es mit anderen Suchbegriffen oder Filtern.'}
          </p>
          {recipes.length === 0 && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Erstes Rezept erstellen</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={() => onEdit(recipe)}
              onDelete={() => onDelete(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
