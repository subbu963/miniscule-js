import { register } from 'node:module';
import url from 'node:url';

const importMapUrl = url.fileURLToPath(
    import.meta.resolve('../importmap.json'),
);

register('@miniscule-js/importmap-loader', {
    parentURL: import.meta.url,
    data: {
        importMapUrl,
        importsToResolve: ['^micro-backend1$'],
    },
});
