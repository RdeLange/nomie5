/**
 * nid - nomie id
 * A small utility class to generate a unique-ish ID with a set length.
 * Since nomie runs locally, a collision will be unlikedly
 *
 */
import md5 from "md5";
export default (a1?: string | number, a2?: string | number): string => {
  let str: string = `${new Date().getTime() + Math.random()}`;
  let defaultLen: number = 32;
  if (!a1) {
    return md5(str).substr(0, defaultLen);
  } else {
    if (typeof a1 == "string") {
      let len: number = typeof a2 == "number" ? a2 : defaultLen;
      str = a1;
      return md5(str).substr(0, len);
    } else if (typeof a1 == "number") {
      return md5(str).substr(0, a1);
    }
  }
};
