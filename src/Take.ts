import { Iter } from "./Iter";
import { Operator } from "./Operator";

export function take<T>(size: number): Operator<T, T> {
    return async function* takeOperator(input: Iter<T>): Iter<T> {
        let taken = 0;
        for await (const value of input) {
            yield value;
            taken++;
            if (taken >= size) {
                break;
            }
        }
    };
}
