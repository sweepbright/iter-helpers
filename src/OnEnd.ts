import { type Iter } from "./Iter";
import { type Operator } from "./Operator";

export function onEnd<T>(cb: () => void): Operator<T, T> {
    return async function* onEndOperator(input: Iter<T>): Iter<T> {
        for await (const v of input) {
            yield v;
        }
        cb();
    };
}
