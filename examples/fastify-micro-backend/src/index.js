import fastify from 'fastify';

const server = fastify({});
const { routing: handleRequest } = server;
server.get('/hello', (request, reply) => {
    reply.send({ hello: 'world', from: 'fastify micro-backend' });
});

export const handler = async (minisculeReq) => {
    await server.ready();
    await handleRequest(minisculeReq.req, minisculeReq.res);
};
