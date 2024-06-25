import type Koa from 'koa';

export interface IMinisculeHttpRequestConfig {
    path: string;
    url: string;
    body: unknown;
}
export default class MinisculeHttpRequest {
    path: string;
    url: string;
    body: unknown;
    constructor({ path, url, body }: IMinisculeHttpRequestConfig) {
        this.path = path;
        this.url = url;
        this.body = body;
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
