const test = require('tape');
const redis = require('redis');
const axios = require('axios');

const after = test;

const client = redis.createClient({ host: 'redis' });

test('GET /increment', (t) => {
  axios
    .get('http://hello-world:3000/increment')
    .then((response) => {
      t.equal(response.status, 200, 'response -> status: 200');
      t.equal(response.data.counter, 1, 'response -> data -> counter: 1');
      client.get('counter', (err, value) => {
        if(err) t.fail(err);
        t.equal(value, '1', 'redis -> counter : 1');
        t.end();
      });
    })
    .catch((err) => t.fail(err));
});

after('after', (t) => {
  client.quit();
  t.end();
});