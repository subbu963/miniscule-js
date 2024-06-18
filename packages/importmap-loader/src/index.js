import { ImportMap } from '@jspm/import-map';
import fs from 'node:fs/promises';

const config = {};
function shouldResolve(specifier) {
  const { importsToResolve } = config;
  return importsToResolve.some((r) => r.test(specifier));
}
async function getImportMap(url) {
  try {
    let importMapJson = null;

    if(url.startsWith('http')) {
      console.log('here1');
      importMapJson = await fetch(url).then(r => r.json());
    } else {
      console.log('here2');
      console.log('getting import map', url);
      importMapJson = JSON.parse(await fs.readFile(url, {encoding: 'utf-8'}));
    }
    return new ImportMap({map: importMapJson});
  } catch (error) {
    console.error(error, error.stack)
    throw `Unable to get import map from ${url}`;
  }
}
export async function initialize({ importMapUrl, importsToResolve = [], importMap = null } ) {
  if(!importMapUrl && !importMap) {
    throw 'Atleast one of importMapUrl or importMap need to be set';
  }

  importsToResolve = importsToResolve.map(i => new RegExp(i, 'gi'));
  Object.assign(config, {
    importMapUrl,
    importsToResolve,
    importMap: importMap || await getImportMap(importMapUrl),
  });
}
export async function load(url, context, nextLoad) {
  if(url.startsWith('http')) {
    const module = await fetch(url).then(r => r.text());
    return {
        format: 'module',
        shortCircuit: true,
        source: module,
      };
  }
  return nextLoad(url);
}
export async function resolve(specifier, context, nextResolve) {
    const useImportMapResolver = shouldResolve(specifier);
    if(useImportMapResolver) {
      const { importMap } = config;
      const importMapResolvedModule = importMap.resolve(specifier);
      return {
        url: importMapResolvedModule,
        shortCircuit: true,
      };
    }
  
    return nextResolve(specifier, context);
  }