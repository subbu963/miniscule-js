import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import minisculeMiddleware from '@miniscule-js/koa-middleware';

const app = new Koa();
app.use(bodyParser());
app.use(
    minisculeMiddleware({
        async getRoutes() {
            return [
                {
                    app: 'micro-backend1',
                    activeWhen: '/hello',
                },
            ];
        },
    }),
);

app.use(async (ctx) => {
    ctx.body = 'Hello World';
});

app.listen(3000);
