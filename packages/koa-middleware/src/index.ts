import type { IRoute } from '@miniscule-js/shared-types/apps';
import type Koa from 'koa';

export interface IConfig {
    getRoutes: () => Promise<IRoute[]>;
}
const middleware = (config: IConfig): Koa.Middleware => {
    const { getRoutes } = config;
    const routesPromise = getRoutes();
    return async (
        ctx: Koa.ParameterizedContext<
            Koa.DefaultState,
            Koa.DefaultContext,
            // biome-ignore lint/suspicious/noExplicitAny: Third party library
            any
        >,
        next: Koa.Next,
    ) => {
        const routes = await routesPromise;
        const route = routes.find((r) => {
            if (typeof r.activeWhen === 'string') {
                return r.activeWhen === ctx.path;
            }
            return r.activeWhen(ctx.path);
        });
        if (!route) {
            await next();
            return;
        }
        const app = await import(route.app);
        // @ts-ignore
        if (!ctx.request?.body) {
            throw 'koa-bodyparser not included';
        }
        // @ts-ignore
        ctx.body = await app.handler(ctx.path, ctx.request.body);
    };
};
export default middleware;
