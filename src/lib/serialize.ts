type SerializeBigInts<T> = { [K in keyof T]: T[K] extends bigint ? string : T[K] };

export function serializeBigInts<T extends Record<string, unknown>>(row: T): SerializeBigInts<T> {
  const result = {} as SerializeBigInts<T>;
  for (const key in row) {
    const value = row[key];
    result[key] = (typeof value === "bigint" ? value.toString() : value) as SerializeBigInts<T>[typeof key];
  }
  return result;
}
