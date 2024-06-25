import fs from 'node:fs/promises';
import type { InitializeHook, LoadHook, ResolveHook } from 'node:module';
import { type IImportMap, ImportMap } from '@jspm/import-map';

export interface IConfig {
    importMapUrl?: string;
    importsToResolve?: RegExp[];
    importMap: ImportMap;
}

export type IInitializeOpts = IConfig & {
    importMap?: IImportMap;
    importsToResolve?: string[];
};

let config: IConfig;
function shouldResolve(specifier: string): boolean {
    const { importsToResolve } = config;
    return (importsToResolve || []).some((r) => r.test(specifier));
}
async function getImportMap(url: string): Promise<ImportMap> {
    try {
        let importMapJson = null;

        if (url.startsWith('http')) {
            importMapJson = await fetch(url).then((r) => r.json());
        } else {
            importMapJson = JSON.parse(
                await fs.readFile(url, { encoding: 'utf-8' }),
            );
        }
        return new ImportMap({ map: importMapJson });
    } catch (error) {
        throw `Unable to get import map from ${url}`;
    }
}
export const initialize: InitializeHook = async ({
    importMapUrl,
    importsToResolve = [],
    importMap,
}: IInitializeOpts) => {
    if (!importMapUrl && !importMap) {
        throw 'Atleast one of importMapUrl or importMap need to be set';
    }

    config = {
        importMapUrl,
        importsToResolve: importsToResolve.map((i) => new RegExp(i, 'gi')),
        importMap: importMap
            ? new ImportMap({ map: importMap })
            : await getImportMap(importMapUrl as string),
    };
};
export const load: LoadHook = async function load(
    url: string,
    context,
    nextLoad,
) {
    if (url.startsWith('http')) {
        const module = await fetch(url).then((r) => r.text());
        return {
            format: 'module',
            shortCircuit: true,
            source: module,
        };
    }
    return nextLoad(url);
};
export const resolve: ResolveHook = async function resolve(
    specifier,
    context,
    nextResolve,
) {
    const useImportMapResolver = shouldResolve(specifier);
    if (useImportMapResolver) {
        const { importMap } = config;
        const importMapResolvedModule = importMap.resolve(specifier);
        return {
            url: importMapResolvedModule,
            shortCircuit: true,
        };
    }

    return nextResolve(specifier, context);
};
