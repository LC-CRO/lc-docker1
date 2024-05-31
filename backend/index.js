const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./db');

const db = new Database({
    host: 'database', 
    user: 'root',
    password: 'password',
    database: 'todoapp'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/todos', async (req, res) => {
    if (db.state === 'disconnected') {
        return res.status(403).send({ error: 'Database not ready' });
    }
    try {
        const results = await db.query('SELECT * FROM todos');
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/todos', async (req, res) => {
     if (db.state === 'disconnected') {
        return res.status(403).send({ error: 'Database not ready' });
    }
    const todo = req.body;
    try {
        const results = await db.query('INSERT INTO todos (content) VALUES (?)', [todo.content]);
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/todos/:id', async (req, res) => {
     if (db.state === 'disconnected') {
        return res.status(403).send({ error: 'Database not ready' });
    }
    const id = req.params.id;
    try {
        const results = await db.query('DELETE FROM todos WHERE id = ?', [id]);
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
