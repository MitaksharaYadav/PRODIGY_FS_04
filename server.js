const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'social_media',
    password: '123456',
    port: 5432,
});

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching posts', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to create a new post
app.post('/api/posts', async (req, res) => {
    const { content } = req.body;
    try {
        await pool.query('INSERT INTO posts (content, created_at) VALUES ($1, NOW())', [content]);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve the main HTML file for the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
