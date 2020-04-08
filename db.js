const redis = require('redis');

const r_client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

module.exports = {
    set: (key, val) => {
        return new Promise((resolve, reject) => {
            r_client.set(key, val, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },

    get: (key) => {
        return new Promise((resolve, reject) => {
            r_client.get(key, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },

    get_hm: (key, field) => {
        return new Promise((resolve, reject) => {
            r_client.hget(key, field, (err, result) => {
                if (err) reject(er);
                resolve(result);
            })
        })
    },

    set_hm: (key, field, val) => {
        return new Promise((resolve, reject) => {
            r_client.hset(key, field, val, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },

    get_all_hm: (key) => {
        return new Promise((resolve, reject) => {
            r_client.hgetall(key, (err, result) => {
                if (err || !result) reject(err);
                resolve(result);
            })
        })
    }
}