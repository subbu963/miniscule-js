import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/hello', (ctx, next) => {
    ctx.body = { hello: 'world', from: 'koa micro-backend' };
});
app.use(router.routes()).use(router.allowedMethods());
const handleRequest = app.callback();

export const handler = async (minisculeReq) => {
    await handleRequest(minisculeReq.req, minisculeReq.res);
};
