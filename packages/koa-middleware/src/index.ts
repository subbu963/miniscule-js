import type { IRoute } from '@miniscule-js/shared-types/apps';
import type Koa from 'koa';
import MinisculeHttpRequest from '@miniscule-js/cgi/common/request';

export interface IConfig {
    getRoutes: () => Promise<IRoute[]>;
    methodsWithBody?: string[];
}
const middleware = (config: IConfig): Koa.Middleware => {
    const { getRoutes, methodsWithBody = ['POST', 'PUT', 'PATCH'] } = config;
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
        if (
            methodsWithBody.includes(ctx.method.toUpperCase()) &&
            // @ts-ignore
            !ctx.request?.body
        ) {
            throw 'koa-bodyparser not included';
        }
        // @ts-ignore
        ctx.body = await app.handler(MinisculeHttpRequest.fromKoa(ctx));
    };
};
export default middleware;
