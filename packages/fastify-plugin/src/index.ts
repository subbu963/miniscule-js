import type { IRoute } from '@miniscule-js/shared-types/apps';
import MinisculeHttpRequest from '@miniscule-js/cgi/common/request';
import fp from 'fastify-plugin';
import middie, { type Handler } from '@fastify/middie';

export interface IConfig {
    getRoutes: () => Promise<IRoute[]>;
    methodsWithBody?: string[];
}
const plugin = fp<IConfig>(async (server, config) => {
    await server.register(middie);
    const { getRoutes, methodsWithBody = ['POST', 'PUT', 'PATCH'] } = config;
    const routesPromise = getRoutes();
    const routes = await routesPromise;

    server.use(((req, res, next) => {
        const route = routes.find((r) => {
            if (typeof r.activeWhen === 'string') {
                return r.activeWhen === req.url;
            }
            return r.activeWhen(req.url as string);
        });
        if (!route) {
            next();
            return;
        }
        import(route.app)
            .then((app) => {
                return app.handler(MinisculeHttpRequest.fromFastify(req, res));
            })
            .then(() => next());
    }) as Handler);
});
export default plugin;
