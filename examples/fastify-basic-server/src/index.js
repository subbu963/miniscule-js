import fastify from 'fastify';
import minisculePlugin from '@miniscule-js/fastify-plugin';

const server = fastify({});
const port = 3001;
const host = '0.0.0.0';

await server.register(minisculePlugin, {
    async getRoutes() {
        return [
            {
                app: 'my-micro-backend',
                activeWhen: '/hello',
            },
        ];
    },
});
await server.ready();
await server.listen({ host, port });

export default server;
