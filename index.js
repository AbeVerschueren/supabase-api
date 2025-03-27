import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/minifigs', async (req, res) => {
  const { data, error } = await supabase.from('minifigs').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.use(express.json()); 

// endpoint sets
app.get('/sets', async (req, res) => {
  const { data, error } = await supabase.from('sets').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// endpoint theme
app.get('/theme', async (req, res) => {
  const { data, error } = await supabase.from('theme').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});


app.post('/minifigs', async (req, res) => {
  const { name, rarity, img, auth } = req.body;

  if (auth !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Niet geautoriseerd' });
  }

  const { data, error } = await supabase
    .from('minifigs')
    .insert([{ name, rarity, img }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ success: true, data });
});


app.post('/sets', async (req, res) => {
  const { naam, img, code, theme, auth } = req.body;

  console.log('Ontvangen data:', { naam, img, code, theme, auth });

  if (auth !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Niet geautoriseerd' });
  }

  const { data, error } = await supabase
    .from('sets')
    .insert([{ naam, img, code, theme: parseInt(theme) }]);

  if (error) {
    console.error('Supabase fout:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ success: true, data });
});



app.post('/theme', async (req, res) => {
  const { naam, img, auth } = req.body;

  if (auth !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Niet geautoriseerd' });
  }

  const { data, error } = await supabase
    .from('theme')
    .insert([{ naam, img }]);

  if (error) {
    console.error('Fout bij theme insert:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ success: true, data });
});

app.listen(port, () => {
  console.log(`API runnning on`);
});
