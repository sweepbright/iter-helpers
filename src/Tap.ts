import { Iter } from "./Iter";
import { Operator } from "./Operator";

export function tap<T>(
    tapper: (input: T) => void | Promise<void>
): Operator<T, T> {
    return async function* tapOperator(input: Iter<T>): Iter<T> {
        for await (const value of input) {
            await tapper(value);
            yield value;
        }
    };
}
