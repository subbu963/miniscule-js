import type { IncomingMessage, ServerResponse } from 'node:http';
import type Koa from 'koa';

export interface IMinisculeHttpRequestConfig {
    path: string;
    url: string;
    body: unknown;
    req: IncomingMessage;
    res: ServerResponse;
}
export default class MinisculeHttpRequest {
    path: string;
    url: string;
    body: unknown;
    req: IncomingMessage;
    res: ServerResponse;
    constructor({ path, url, body, req, res }: IMinisculeHttpRequestConfig) {
        this.path = path;
        this.url = url;
        this.body = body;
        this.req = req;
        this.res = res;
    }
    static fromKoa(
        ctx: Koa.ParameterizedContext<
            Koa.DefaultState,
            Koa.DefaultContext,
            // biome-ignore lint/suspicious/noExplicitAny: Third party library
            any
        >,
    ) {
        return new MinisculeHttpRequest({
            path: ctx.path,
            url: ctx.url,
            // @ts-ignore
            body: ctx.request.body,
            req: ctx.req,
            res: ctx.res,
        });
    }
    toJSON() {
        return {
            path: this.path,
            url: this.url,
            body: this.body,
        };
    }
}
