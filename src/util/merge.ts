type AnyObject = { [key: string]: any };

export default function merge<T extends AnyObject, U extends AnyObject>(
  obj: T = {} as T,
  defaults: U
): T & U {
  const result = { ...defaults, ...obj };
  return result;
}
