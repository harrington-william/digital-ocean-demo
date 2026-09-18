import type { Varchar } from "@prisma/orm-postgres/target/codec-types";

export class VarcharTooLongError extends Error {}

export function toVarchar<N extends number>(value: string, maxLength: N): Varchar<N> {
  if (value.length > maxLength) {
    throw new VarcharTooLongError(`must be at most ${maxLength} characters`);
  }
  return value as Varchar<N>;
}
