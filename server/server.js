const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/api/users', async (req, res) => {
    const { firstName, lastName, phone } = req.body;

    const { data, error } = await supabase
        .from('profiles')
        .insert([{ first_name: firstName, last_name: lastName, phone }]);

    if (error) return res.status(400).json(error);
    res.status(200).json({ message: 'Success!', data });
});

// GET all profiles
app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('id', { ascending: false });

    if (error) return res.status(400).json(error);
    res.status(200).json(data);
});

// DELETE a profile
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json(error);
    res.status(200).json({ message: 'Deleted' });
});

// Update a profile
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;
    const { data, error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName, phone })
        .eq('id', id);

    if (error) return res.status(400).json(error);
    res.status(200).json(data);
});

app.listen(5000, () => console.log('Server running on port 5000'));