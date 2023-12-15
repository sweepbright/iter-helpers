import { bufferize } from "./Bufferize";
import { Operator } from "./Operator";

export function interval<T>(size: number): Operator<T, [T, T]> {
    return bufferize({
        getInitialValue: (): [T, T] | null => null,
        reducer(acc, value): [T, T] {
            if (acc === null) {
                return [value, value];
            }
            acc[1] = value;
            return acc;
        },
        shouldFlush: (_, __, bufferizedItemsCount) =>
            bufferizedItemsCount >= size,
    }) as Operator<T, [T, T]>;
}
