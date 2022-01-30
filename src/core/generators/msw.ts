import {
  GeneratorDependency,
  GeneratorImport,
  GeneratorOptions,
  GeneratorVerbOptions,
} from '../../types/generator';
import { pascal } from '../../utils/case';
import { getRouteMSW } from '../getters/route.msw';
import { generateDependencyImports } from './imports';
import { getMockDefinition, getMockOptionsDataOverride } from './mocks';

<<<<<<< HEAD
=======
const getRoutePath = (path: string) => {
  return path.split('').reduce((acc, letter) => {
    if (letter === '{') {
      return acc + ':';
    }

    if (letter === '}') {
      return acc + '';
    }

    return acc + sanitize(letter);
  }, '');
};

export const getRoute = (route: string, baseUrl = '*') => {
  const splittedRoute = route.split('/');

  // TODO: Move to configuration object
  const REMOVE_VERSION_PART = true;

  return (REMOVE_VERSION_PART ? splittedRoute.splice(1, splittedRoute.length) : splittedRoute).reduce((acc, path) => {
    if (!path) {
      return acc;
    }

    if (!path.includes('{')) {
      return `${acc}/${path}`;
    }

    return `${acc}/${getRoutePath(path)}`;
  }, baseUrl);
};

>>>>>>> 8f5bcfd (feat: Allow dates to be deserialized as JavaScript Date objects)
const MSW_DEPENDENCIES: GeneratorDependency[] = [
  {
    exports: [{ name: 'rest', values: true }],
    dependency: 'msw',
  },
  {
    exports: [{ name: 'faker', values: true }],
    dependency: '@faker-js/faker',
  },
];

export const generateMSWImports = (
  implementation: string,
  imports: {
    exports: GeneratorImport[];
    dependency: string;
  }[],
  specsName: Record<string, string>,
  hasSchemaDir: boolean,
  isAllowSyntheticDefaultImports: boolean,
): string => {
  return generateDependencyImports(
    implementation,
    [...MSW_DEPENDENCIES, ...imports],
    specsName,
    hasSchemaDir,
    isAllowSyntheticDefaultImports,
  );
};

export const generateMSW = async (
  { operationId, response, verb, tags }: GeneratorVerbOptions,
  { pathRoute, override, context }: GeneratorOptions,
) => {
  const { definitions, definition, imports } = await getMockDefinition({
    operationId,
    tags,
    response,
    override,
    context,
  });

  const route = getRouteMSW(pathRoute, override?.mock?.baseUrl);
  const mockData = getMockOptionsDataOverride(operationId, override);

  let value = '';

  if (mockData) {
    value = mockData;
  } else if (definitions.length > 1) {
    value = `faker.helpers.arrayElement(${definition})`;
  } else if (definitions[0]) {
    value = definitions[0];
  }

  const responseType = response.contentTypes.includes('text/plain')
    ? 'text'
    : 'json';

  return {
    implementation: {
      function:
        value && value !== 'undefined'
          ? `export const get${pascal(operationId)}Mock = () => (${value})\n\n`
          : '',
      handler: `rest.${verb}('${route}', (_req, res, ctx) => {
        return res(
          ctx.delay(${override?.mock?.delay || 1000}),
          ctx.status(200, 'Mocked status'),${
            value && value !== 'undefined'
              ? `\nctx.${responseType}(get${pascal(operationId)}Mock()${responseType === 'text' ? '.toString()' : ''}),`
              : ''
          }
        )
      }),`,
    },
    imports,
  };
};
