import { sleep } from "./tests/sleep";

export interface FifoOptions {
    highWatermark?: number;
    onSizeChange?: (size: number) => void;
}

export class Fifo<T> implements AsyncIterable<T> {
    #queue: T[] = [];
    #ended = false;

    #onDrain?: () => void;
    #onDrainPromise?: Promise<void>;
    #isDrain() {
        return this.options?.highWatermark
            ? this.#queue.length < this.options?.highWatermark
            : true;
    }

    #onEnd?: () => void;
    #waitEnd() {
        if (this.#ended) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve) => (this.#onEnd = resolve));
    }

    #onPush?: () => void;
    #waitPush() {
        return new Promise<void>((resolve) => (this.#onPush = resolve));
    }

    async *#flush(): AsyncGenerator<T> {
        while (this.#queue.length) {
            const prevIsDrain = this.#isDrain();
            yield this.#queue.shift() as T;
            this.#reportSize();
            if (this.#isDrain() && !prevIsDrain) {
                this.#onDrain?.();
            }
        }
    }

    constructor(private options?: FifoOptions) {}

    /**
     * Push an item to the queue.
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
     */
    push(item: T): boolean {
        if (this.#ended) {
            return false;
        }
        this.#queue.push(item);
        this.#reportSize();
        const isDrain = this.#isDrain();
        this.#onPush?.();
        return isDrain;
    }

    #reportSize() {
        this.options?.onSizeChange?.(this.#queue.length);
    }
    waitDrain(): Promise<void> {
        if (this.#isDrain()) {
            return sleep(0);
        }

        const onDrainPromise =
            this.#onDrainPromise ??
            new Promise<void>((resolve) => {
                this.#onDrain = resolve;
            }).then(() => {
                this.#onDrain = undefined;
                this.#onDrainPromise = undefined;
            });
        if (!this.#onDrainPromise) {
            this.#onDrainPromise = onDrainPromise;
        }
        return this.#onDrainPromise;
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
     * return `false` and won't result in an item being pushed.     *
     */
    end() {
        if (this.#ended) {
            return;
        }
        this.#ended = true;
        const onEnd = this.#onEnd;
        onEnd?.();
    }

    async *[Symbol.asyncIterator]() {
        for (;;) {
            yield* this.#flush();
            await Promise.race([this.#waitPush(), this.#waitEnd()]);
            if (this.#ended) {
                break;
            }
        }
        yield* this.#flush();
    }
}
