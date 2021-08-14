import { sanitize } from '../../utils/string';

const getRoutePath = (path: string) => {
  return path.split('').reduce((acc, letter) => {
    if (letter === '{') {
      return acc + '${';
    }

    if (letter === '}') {
      return acc + '}';
    }

    return acc + sanitize(letter);
  }, '');
};

export const getRoute = (route: string) => {
  const routeParts = route.split('/');

  // TODO: Move to configuration object
  const REMOVE_VERSION_PART = true;

  return (REMOVE_VERSION_PART ? routeParts.splice(1, routeParts.length) : routeParts).reduce((acc, path) => {
    if (!path) {
      return acc;
    }

    if (!path.includes('{')) {
      return `${acc}/${path}`;
    }

    return `${acc}/${getRoutePath(path)}`;
  }, '');
};
