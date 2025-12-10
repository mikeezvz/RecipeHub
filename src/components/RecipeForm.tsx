import { useState, useEffect } from 'react';
import { X, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import type { Recipe } from '../App';

interface RecipeFormProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
}

export function RecipeForm({ recipe, onClose, onSubmit }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Array<{ name: string; quantity?: string }>>([{ name: '', quantity: '' }]);
  const [instructions, setInstructions] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '' }]);
      setInstructions(recipe.instructions);
      setCalories(recipe.calories);
      setTags(recipe.tags);
      setImage(recipe.image || '');
    }
  }, [recipe]);

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '' }]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, field: 'name' | 'quantity', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filteredIngredients = ingredients.filter(i => i.name.trim() !== '');
      await onSubmit({
        title,
        description,
        ingredients: filteredIngredients,
        instructions,
        calories,
        tags,
        image: image || undefined
      });
    } catch (error) {
      // Fehler wird vom Parent behandelt
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col min-h-[400px]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl sm:text-3xl text-gray-900">{recipe ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollbarer Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">

          {/* Titel */}
          <div>
            <label className="block mb-2 text-gray-700">Titel *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="z.B. Spaghetti Carbonara"
              required
            />
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block mb-2 text-gray-700">Beschreibung *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm sm:text-base"
              placeholder="Kurze Beschreibung des Rezepts..."
              rows={3}
              required
            />
          </div>

          {/* Kalorien */}
          <div>
            <label className="block mb-2 text-gray-700">Kalorien (kcal) *</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              placeholder="z.B. 450"
              min="0"
              required
            />
          </div>

          {/* Bild URL */}
          <div>
            <label className="block mb-2 text-gray-700">Bild URL (optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 text-gray-700">Tags</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                placeholder="z.B. Vegan, Schnell, Gesund"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Hinzufügen
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-full text-sm sm:text-base"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-orange-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Zutaten */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700">Zutaten *</label>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Hinzufügen</span>
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Zutat ${index + 1}`}
                    required
                  />
                  <input
                    type="text"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Menge"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Zubereitung */}
          <div>
            <label className="block mb-2 text-gray-700">Zubereitung *</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm sm:text-base"
              placeholder="Schritt-für-Schritt Anleitung..."
              rows={8}
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird gespeichert...' : recipe ? 'Aktualisieren' : 'Erstellen'}
          </button>
        </div>

      </div>
    </div>
  );
}
