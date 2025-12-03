import { useState } from 'react';
import { Flame, Clock, Edit2, Trash2, X } from 'lucide-react';
import type { Recipe } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    setShowDetails(false);
  };

  return (
    <>
      {/* Card */}
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
        onClick={() => setShowDetails(true)}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
          {recipe.image ? (
            <ImageWithFallback
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🍳</span>
            </div>
          )}
          {/* Calories Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-gray-900">{recipe.calories} kcal</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl mb-2 text-gray-900 line-clamp-1">{recipe.title}</h3>
          <p className="text-gray-600 line-clamp-2 mb-4">{recipe.description}</p>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{recipe.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Bearbeiten</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Löschen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-t-2xl overflow-hidden">
              {recipe.image ? (
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🍳</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-gray-900">{recipe.calories} kcal</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl mb-3 text-gray-900">{recipe.title}</h2>
              <p className="text-gray-600 mb-6">{recipe.description}</p>

              {/* Tags */}
              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-xl mb-3 text-gray-900">Zutaten</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-xl mb-3 text-gray-900">Zubereitung</h3>
                <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                    onEdit();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Bearbeiten</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Löschen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl mb-4 text-gray-900">Rezept löschen?</h3>
            <p className="text-gray-600 mb-6">
              Möchtest du "{recipe.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
