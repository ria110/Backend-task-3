const express = require("express");
const app = express();
const path = require("path");
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');

const port = 8080;
const upload = multer({ dest: 'uploads/' });

const pool = new Pool({
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: '123cherry',
    port: 5432,
});

app.get('/retrieve/:filename', async (req, res) => {
    const { filename } = req.params;

    try {
        const result = await pool.query('SELECT filename, content FROM files WHERE filename = $1', [filename]);

        if (result.rows.length > 0) {
            const file = result.rows[0];
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
            res.send(file.content);
            console.log("file retrieved");
        } else {
            res.json({ error: 'File not found' });
        }
    } catch (err) {
        console.error(err);
        res.json({ error: 'Internal server error' });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        console.log('no file');
        return res.json({ error: 'no file uploaded' });
    }
    
    const { originalname, path } = req.file;
    console.log(`File received: ${originalname}, path: ${path}`);
    
    try {
        const content = await fs.promises.readFile(path);
       
        await pool.query('INSERT INTO files (filename, content) VALUES ($1, $2)', [originalname, content]);
        console.log(`file inserted into database`);
         
        await fs.promises.unlink(path);
       
        res.json({message: 'file uploaded'});
    } catch (err) {
        console.error('error:', err);
        res.json({ error: 'internal server error' });
    }
});

app.delete('/delete/:filename', async (req, res) => {
    const { filename } = req.params;

    try {
        const result = await pool.query('DELETE FROM files WHERE filename = $1', [filename]);

        if (result.rowCount > 0) {
            console.log("file deleted");
            res.json({ message: `Deleted ${result.rowCount} file` });
        } else {
            res.json({ error: 'file not found' });
        }
    } catch (err) {
        console.error(err);
        res.json({ error: 'internal server error' });
    }
});

app.listen(port, (req, res) => {
    console.log(`listening to port ${port}`);
});