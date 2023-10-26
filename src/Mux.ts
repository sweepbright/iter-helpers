/* eslint-disable indent */
import { chain } from "./Chain";
import { Fifo } from "./Fifo";
import { Iter } from "./Iter";

type Iteratee<T> = T extends Iter<infer U> ? U : never;

export class Mux<T extends Iter<unknown>, E extends Iteratee<T> = Iteratee<T>>
    implements AsyncIterable<E>
{
    constructor(private inputs: T[]) {}

    [Symbol.asyncIterator](): AsyncIterator<E> {
        const fifo = new Fifo<E>({ highWatermark: 1 });

        const stopPromises = this.inputs.map((input) =>
            chain(input)
                .tap(async (value) => {
                    await fifo.waitDrain();
                    fifo.push(value as E);
                })
                .consume(),
        );

        Promise.all(stopPromises).then(() => {
            fifo.end();
        });

        return fifo[Symbol.asyncIterator]();
    }
}

export function mux<T extends Iter<unknown>>(
    inputs: T[],
): AsyncIterable<Iteratee<T>> {
    return new Mux(inputs);
}
