import Koa from 'koa';
import Router from 'koa-router';
import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);

const app = new Koa();
const router = new Router();

const { REDIS_SERVICE_HOST, REDIS_SERVICE_PORT } = process.env;

const client = redis.createClient(REDIS_SERVICE_PORT, REDIS_SERVICE_HOST);

client.on('error', (err) => console.log('Error', err));

router.get('/increment', async (ctx, next) => {
  const counter = await incrementCounter();
  ctx.body = {
    counter,
    message: 'hello world!'
  };
});

async function incrementCounter(){
  return await client.incrAsync('counter');
}

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000, () => console.log('Listening on *:3000'));