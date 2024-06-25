import Koa from 'koa';

const app = new Koa();
app.use(async (ctx) => {
    ctx.body = 'yo man';
});
const handleRequest = app.callback();

export const handler = async (minisculeReq) => {
    await handleRequest(minisculeReq.req, minisculeReq.res);
};
