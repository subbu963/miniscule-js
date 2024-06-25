import fastify from 'fastify';

const server = fastify({
    ajv: {
        customOptions: {
            removeAdditional: 'all',
            coerceTypes: true,
            useDefaults: true,
        },
    },
    logger: {
        level: process.env.LOG_LEVEL,
    },
});

await server.ready();

export default server;
