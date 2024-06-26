import Express from 'express';

const server = Express();

server.get('/hello', (req, res) => {
    res.json({ hello: 'world', from: 'express micro-backend' });
});
export const handler = async (minisculeReq) => {
    await new Promise((resolve, reject) => {
        server.handle(minisculeReq.req, minisculeReq.res, (err) => reject(err));
    });
};
