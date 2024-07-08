import { CompatChan } from "@harnyk/chan";

export interface FifoOptions {
    highWatermark?: number;
}

export class Fifo<T> implements AsyncIterable<T> {
    #ch: CompatChan<T>;

    constructor(private options?: FifoOptions) {
        this.#ch = new CompatChan<T>(this.options?.highWatermark ?? Infinity);
    }

    /**
     * Push an item to the queue.
     * @deprecated Use `await send` instead
     *
     * This method returns `true` if the queue is drained, i.e. the queue's
     * length is less than the highWatermark (if any).
     *
     * This method always pushes an item to the queue, even if the queue is above
     * the highWatermark. The control over this behavior is up to the user.
     *
     * It is recommended to use the `waitDrain` method to wait for the queue to
     * be drained.
     *
     * If a user does not wait for the queue to be drained, the `push` method
     * will push the item even if the queue is above the highWatermark until the
     * process memory is overflowed.
     *
     * To drain a queue, the fifo should be iterated over.
     *
     * If the queue is ended, the `push` method will return `false` and the item
     * will not be pushed.
     *
     * @example
     * const queue = new Fifo<string>();
     * await queue.waitDrain();
     * queue.push("a");
     * await queue.waitDrain();
     * queue.push("b");
     * // etc
     *
     * @param item
     * @returns `true` if the queue is drained, `false` otherwise
     *
     */
    push(item: T): boolean {
        return this.#ch.sendSync(item);
    }

    /**
     * @deprecated Use `await send` instead
     */
    waitDrain(): Promise<void> {
        return this.#ch.readySend();
    }

    /**
     * Sends an item to the fifo.
     *
     * Resolves as soon as the item is actually pushed.
     * If the internal queue is full, blocks until the queue is drained.
     */
    send(item: T): Promise<void> {
        return this.#ch.send(item);
    }

    /**
     * End the queue.
     *
     * This method stops the queue from pushing more items.
     *
     * If the queue has items and it's being iterated over,
     * the items will eventually be flushed, then the iteration will stop.
     *
     * After the `end` method is called, calls to the `push` method will
     * return `false` and won't result in an item being pushed.
     *
     * Resolves once all items are read by consumers.
     */
    end(): Promise<void> {
        return this.#ch.close();
    }

    get stat() {
        return this.#ch.stat;
    }

    async *[Symbol.asyncIterator]() {
        yield* this.#ch;
    }
}
