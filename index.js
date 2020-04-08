const express = require('express');
const app = express();
const config = require('./config');
const db = require('./db');
const multer = require('multer');
const xlsx = require('./xlsx');
const fileUpload = require('express-fileupload');
const path = require('path');

global.appRoot = path.resolve(__dirname);

app.use(express.static('dl'));
app.use(fileUpload());

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

let brand_map = {
    1: 'Cenovis',
    2: 'Ostelin',
    3: 'Selsun'
};

let store_map = {
    1: 'Tmall',
    2: 'JD',
    3: 'Kaola',
    4: 'Redbook'
}

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
    let _brand = req.param('brand');
    let _brands = [];
    if (_brand == 'overview') {
        _brands = Object.values(brand_map);
    } else {
        _brands.push(_brand);
    }
    let gmv = 0;
    let volume = 0;
    for(let i=0; i<_brands.length; i++) {
        try {
            let _data = await db.get_all_hm(_brands[i]);
            let _one_brand = Object.values(_data).map((_sale) => {
                return JSON.parse(_sale);
            }).reduce((prev, next) => {
                return {
                    'gmv': prev.gmv+Number(next.gmv),
                    'volume': prev.volume+Number(next.volume)
                }
            });
            gmv = gmv+_one_brand.gmv;
            volume = volume+_one_brand.volume;
        } catch (e) {
            console.log(e);
        }
    }
    console.log(gmv, volume);
    let _json = {
            'gmv': gmv,
            'volume': volume,
            'base_achievement': '101.1%',
            'stretch_achievement': '102.2%',
            'base_target': '122223111',
            'stretch_target': '18800000',
            'progress': '+101.2%',
            'period': '5.21-618',
    }
    res.send({
        'error': 0,
        'data': _json
    });
});

app.get('/detail', async (req, res) => {
    let _store = req.param('store');
    let _brand = req.param('brand');
    let _brands = [];
    if (_brand == 'overview') {
        _brands = Object.values(brand_map);
    } else {
        _brands.push(_brand);
    }
    let _data_list = [];
    for(let i=0; i<_brands.length; i++) {
        try {
            let _data = await db.get_all_hm(_brands[i]);
            let _stores = Object.keys(_data).map((_store) => {
                let _sale = JSON.parse(_data[_store]);
                return {
                    'store': _store,
                    'gmv': Number(_sale.gmv),
                    'volume': Number(_sale.volume),
                    'base_achievement': '102.1%',
                    'stretch': '90.2%'
                }
            });
            _data_list = _data_list.concat(_stores);
        } catch (e) {
            console.log(e);
        }
    }
    console.log(_data_list);
    let _cache_list = [];
    for(let i=0; i<_data_list.length; i++) {
        let _index = _cache_list.findIndex((elem, index, array) => {
            return elem.store == _data_list[i].store;
        });
        if (_index < 0) {
            _cache_list.push(_data_list[i]);
        } else {
            _cache_list[_index].gmv = _cache_list[_index].gmv+_data_list[i].gmv;
        }
    }
    _cache_list.sort((prev, next) => {
        return prev.gmv>=next.gmv?-1:1;
    })
    //let _list = [
    //    {
    //        'store': 'Tmall',
    //        'gmv': '20213001.23',
    //        'base_achievement': '102.2%',
    //        'stretch': '80.2%'
    //    },
    //    {
    //        'store': 'JD',
    //        'gmv': '10213001.23',
    //        'base_achievement': '102.2%',
    //        'stretch': '80.2%'
    //    },
    //    {
    //        'store': 'Kaola',
    //        'gmv': '8213001.23',
    //        'base_achievement': '102.2%',
    //        'stretch': '80.2%'
    //    },
    //    {
    //        'store': 'Redbook',
    //        'gmv': '6213001.23',
    //        'base_achievement': '102.2%',
    //        'stretch': '80.2%'
    //    },
    //    {
    //        'store': 'Other',
    //        'gmv': '4213001.23',
    //        'base_achievement': '102.2%',
    //        'stretch': '80.2%'
    //    },
    //];
    res.send({
        'error': 0,
        'data': _cache_list
    })
});

app.post('/upload/file', async (req, res) => {
    if (req.files) {
        let _xlsx = req.files.xlsx;
        _xlsx.mv(appRoot+'/tmp/data.xlsx', (err) => {
            if (err) res.send('upload failed');
            let _json = xlsx.parse_xlsx('./tmp/data.xlsx');
            _json.forEach((_data) => {
                let _vals = Object.values(_data);
                let _sales = {
                    'gmv': _vals[2],
                    'volume': _vals[3]
                };
                db.set_hm(brand_map[_vals[0]], store_map[_vals[1]], JSON.stringify(_sales));
            })
        });
    }
    res.send('ok');
});

app.listen(config.SERVER_PORT, () => console.log(`listening on port ${config.SERVER_PORT}!`));