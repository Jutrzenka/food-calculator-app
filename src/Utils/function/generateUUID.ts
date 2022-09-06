import * as hyperid from 'hyperid';

export function generateUUID() {
  return hyperid({ fixedLength: true, urlSafe: true }).uuid;
}
