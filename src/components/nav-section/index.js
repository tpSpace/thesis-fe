export { default as NavSectionVertical } from './vertical';

export function isExternalLink(path) {
  return path.includes('http');
}

export function getActive(path, pathname, asPath) {
  return pathname.includes(path) || asPath.includes(path);
}
