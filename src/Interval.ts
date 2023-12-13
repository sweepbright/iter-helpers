import { Iter } from "./Iter";
import { Operator } from "./Operator";

export function interval<T>(size: number): Operator<T, [T, T]> {
    return async function* intervalOperator(input: Iter<T>): Iter<[T, T]> {
        let currentInterval: [T, T] | null = null;
        let currentLength = 0;

        for await (const value of input) {
            if (currentInterval === null) {
                currentInterval = [value, value];
            } else {
                currentInterval[1] = value;
            }
            currentLength++;

            if (currentLength === size) {
                yield currentInterval;
                currentInterval = null;
                currentLength = 0;
            }
        }
        if (currentLength > 0 && currentInterval !== null) {
            yield currentInterval;
        }
    };
}
