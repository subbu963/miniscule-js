import server from './server.js';

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

const port = 3001;
const host = '0.0.0.0';
await server.listen({ host, port });

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
        server.close().then((err) => {
            console.log(`close application on ${signal}`);
            process.exit(err ? 1 : 0);
        }),
    );
}
