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
});

app.get('/total', async (req, res) => {
    let _store = req.param('store');
    let _brand = req.param('brand');
    let _json = {
           'gmv': '1823010188.23',
           'base_achievement': '101.1%',
           'target_phasing': '102.2%',
           'base_target': '122223111',
           'stretch': '18800000',
           'evolution': '+101.2%',
           'presell_gmv': '180203002.10',
           'presell_convert': '100%'
    }
    res.send({
        'error': 0,
        'data': _json
    });
});

app.get('/detail', async (req, res) => {
    let _store = req.param('store');
    let _brand = req.param('brand');
    let _list = [
        {
            'store': 'Tmall',
            'gmv': '20213001.23',
            'base_achievement': '102.2%',
            'stretch': '80.2%'
        },
        {
            'store': 'JD',
            'gmv': '10213001.23',
            'base_achievement': '102.2%',
            'stretch': '80.2%'
        },
        {
            'store': 'Kaola',
            'gmv': '8213001.23',
            'base_achievement': '102.2%',
            'stretch': '80.2%'
        },
        {
            'store': 'Redbook',
            'gmv': '6213001.23',
            'base_achievement': '102.2%',
            'stretch': '80.2%'
        },
        {
            'store': 'Other',
            'gmv': '4213001.23',
            'base_achievement': '102.2%',
            'stretch': '80.2%'
        },
    ];
    res.send({
        'error': 0,
        'data': _list
    })
})

app.listen(config.SERVER_PORT, () => console.log(`listening on port ${config.SERVER_PORT}!`));