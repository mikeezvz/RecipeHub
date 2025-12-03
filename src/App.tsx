import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { WelcomePage } from './components/WelcomePage';
import { RecipeList } from './components/RecipeList';
import { RecipeForm } from './components/RecipeForm';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { toast, Toaster } from 'sonner@2.0.3';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  tags: string[];
  image?: string;
  userId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'recipes'>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    checkSession();
  }, []);

  // Load recipes when user changes
  useEffect(() => {
    if (user) {
      loadRecipes();
    }
  }, [user]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session) {
        setAccessToken(session.access_token);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const token = accessToken || (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05624468/recipes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Fehler beim Laden der Rezepte');
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05624468/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, password, name })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }

      toast.success('Account erfolgreich erstellt!');
      
      // Auto-login after signup
      await handleSignIn(email, password);
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Fehler bei der Registrierung');
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (session) {
        setAccessToken(session.access_token);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!
        });
        setShowAuthModal(false);
        toast.success('Erfolgreich angemeldet!');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Fehler beim Anmelden');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setRecipes([]);
      setCurrentPage('welcome');
      toast.success('Erfolgreich abgemeldet');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Fehler beim Abmelden');
    }
  };

  const handleCreateRecipe = async (recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const token = accessToken || (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05624468/recipes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(recipeData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create recipe');
      }

      const data = await response.json();
      setRecipes([...recipes, data.recipe]);
      setShowRecipeForm(false);
      toast.success('Rezept erfolgreich erstellt!');
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      toast.error(error.message || 'Fehler beim Erstellen des Rezepts');
      throw error;
    }
  };

  const handleUpdateRecipe = async (id: string, recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const token = accessToken || (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05624468/recipes/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(recipeData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update recipe');
      }

      const data = await response.json();
      setRecipes(recipes.map(r => r.id === id ? data.recipe : r));
      setShowRecipeForm(false);
      setEditingRecipe(null);
      toast.success('Rezept erfolgreich aktualisiert!');
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      toast.error(error.message || 'Fehler beim Aktualisieren des Rezepts');
      throw error;
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const token = accessToken || (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-05624468/recipes/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete recipe');
      }

      setRecipes(recipes.filter(r => r.id !== id));
      toast.success('Rezept erfolgreich gelöscht!');
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      toast.error(error.message || 'Fehler beim Löschen des Rezepts');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <Toaster position="top-right" richColors />
      
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onAuthClick={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      {currentPage === 'welcome' ? (
        <WelcomePage
          onGetStarted={() => {
            if (user) {
              setCurrentPage('recipes');
            } else {
              setShowAuthModal(true);
            }
          }}
        />
      ) : (
        <RecipeList
          recipes={recipes}
          onCreateNew={() => {
            setEditingRecipe(null);
            setShowRecipeForm(true);
          }}
          onEdit={(recipe) => {
            setEditingRecipe(recipe);
            setShowRecipeForm(true);
          }}
          onDelete={handleDeleteRecipe}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
        />
      )}

      {showRecipeForm && (
        <RecipeForm
          recipe={editingRecipe}
          onClose={() => {
            setShowRecipeForm(false);
            setEditingRecipe(null);
          }}
          onSubmit={(recipeData) => {
            if (editingRecipe) {
              return handleUpdateRecipe(editingRecipe.id, recipeData);
            } else {
              return handleCreateRecipe(recipeData);
            }
          }}
        />
      )}
    </div>
  );
}
