import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.ts';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://recipehub-taupe.vercel.app' 

    ];
        if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Create Supabase client helper
const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};

// Auth middleware to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Access token missing');
  }

  const supabase = createSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Unauthorized: Invalid or expired token');
  }

  return user;
}

// Sign Up Route
app.post('/make-server-05624468/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user during signup:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error: any) {
    console.error('Error in signup route:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Get all recipes for user
app.get('/make-server-05624468/recipes', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));

    // Get all recipes for this user
    const prefix = `recipe:${user.id}:`;
    const recipes = await kv.getByPrefix(prefix);

    return c.json({ recipes: recipes || [] });
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    return c.json({ error: error.message || 'Failed to fetch recipes' }, 500);
  }
});

// Create recipe
app.post('/make-server-05624468/recipes', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    const recipeData = await c.req.json();

    // Validate required fields
    if (!recipeData.title || !recipeData.description || !recipeData.ingredients || !recipeData.instructions) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create recipe with unique ID
    const recipeId = crypto.randomUUID();
    const recipe = {
      id: recipeId,
      ...recipeData,
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    // Store in KV store
    const key = `recipe:${user.id}:${recipeId}`;
    await kv.set(key, recipe);

    return c.json({ recipe });
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    return c.json({ error: error.message || 'Failed to create recipe' }, 500);
  }
});

// Update recipe
app.put('/make-server-05624468/recipes/:id', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    const recipeId = c.req.param('id');
    const recipeData = await c.req.json();

    // Get existing recipe
    const key = `recipe:${user.id}:${recipeId}`;
    const existingRecipe = await kv.get(key);

    if (!existingRecipe) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

    // Ensure user owns the recipe
    if (existingRecipe.userId !== user.id) {
      return c.json({ error: 'Unauthorized to update this recipe' }, 403);
    }

    // Update recipe
    const updatedRecipe = {
      ...existingRecipe,
      ...recipeData,
      id: recipeId,
      userId: user.id,
      createdAt: existingRecipe.createdAt
    };

    await kv.set(key, updatedRecipe);

    return c.json({ recipe: updatedRecipe });
  } catch (error: any) {
    console.error('Error updating recipe:', error);
    return c.json({ error: error.message || 'Failed to update recipe' }, 500);
  }
});

// Delete recipe
app.delete('/make-server-05624468/recipes/:id', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    const recipeId = c.req.param('id');

    // Get existing recipe
    const key = `recipe:${user.id}:${recipeId}`;
    const existingRecipe = await kv.get(key);

    if (!existingRecipe) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

    // Ensure user owns the recipe
    if (existingRecipe.userId !== user.id) {
      return c.json({ error: 'Unauthorized to delete this recipe' }, 403);
    }

    // Delete recipe
    await kv.del(key);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting recipe:', error);
    return c.json({ error: error.message || 'Failed to delete recipe' }, 500);
  }
});

Deno.serve(app.fetch);
