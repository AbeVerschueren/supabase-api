import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Endpoint om alle minifigs op te halen
app.get('/minifigs', async (req, res) => {
  const { data, error } = await supabase.from('minifigs').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
