const express = require('express');
const app = express();
const config = require('./config');
const db = require('./db');
const crawler = require('./crawler');

app.get('/ping', (req, res) => res.send('pong'));

app.get('/set', async (req, res) => {
    let key = req.param('key');
    let val = req.param('val');
    try {
        let result = await db.set(key, val);
        res.send(result);
    } catch (e) {
        console.log(e);
        res.send('error');
    }
});

app.post('/login', async (req, res) => {
    let user_name = req.body.username;
    let pass = req.body.passwd;
    try {
        let result = await db.get_hm('accounts', user_name);
        res.send(result == pass?'ok':'fail');
    } catch (e) {
        res.status(500).send('error occurred');
    }
});

app.get('/tb_test', async (req, res) => {
    try {
        let html = await crawler.get_page_ppy();
        res.send(html);
    } catch (e) {
        res.send('failed');
    }
})

app.listen(config.SERVER_PORT, () => console.log(`listening on port ${config.SERVER_PORT}!`));