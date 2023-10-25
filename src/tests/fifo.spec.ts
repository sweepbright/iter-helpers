import { chain } from "../Chain";
import { Fifo } from "../Fifo";
import { range } from "../Range";
import { sleep } from "./sleep";

describe("fifo", () => {
    it("creates an async iterator to which you can push items externally", async () => {
        const f = new Fifo<number>();

        // Let's start two processes at the same time:
        //  - iterate a fifo by consuming its items
        //  - push some items to the fifo
        const [results] = await Promise.all([
            chain(f).toArray(),
            (async (): Promise<void> => {
                f.push(1);
                f.push(2);
                f.push(3);
                f.end();
            })(),
        ]);

        expect(results).toEqual([1, 2, 3]);
    });

    it("allows for back-pressure behavior", async () => {
        const highWatermark = 2;
        let maxObservedSize = 0;

        const f = new Fifo<number>({
            highWatermark,
            onSizeChange: (size) => {
                maxObservedSize = Math.max(maxObservedSize, size);
            },
        });

        const report: string[] = [];

        const log = (item: string) => {
            report.push(item);
        };

        const mainChain = chain(range(0, 10))
            .tap(async (item) => {
                // 💡Note that we are using the `waitDrain` method here
                // in order to make sure that the queue is drained.
                // Use it as a best practice.
                // 💡Another best practice is to avoid
                // parallelizing the calls to `await waitDrain()` and `push()`.
                // 💡There is an obvious reason to call `await waitDrain()` from inside
                // any function that would pause an iteration of the chain, like
                // in this example.
                await f.waitDrain();
                f.push(item);
            })
            // This trick allows to call `end` only once, when all items
            // have been pushed
            .batch(Infinity)
            .tap(() => {
                f.end();
            })
            .flatten();

        const fifoReader = chain(f)
            .tap((item) => log(`Read: ${item}`))
            .tap(async () => {
                // In this test, the reader should perform slower
                // than the writer, because we want to test that
                // the queue can grow to its highWatermark.
                await sleep(50);
            });

        const [itemsWritten, itemsRead] = await Promise.all([
            mainChain.toArray(),
            fifoReader.toArray(),
        ]);

        // Check that the queue has not grown above the highWatermark
        expect(maxObservedSize).toBe(highWatermark);

        // Check that the reader has read all the items
        expect(itemsWritten).toEqual(itemsRead);
    });
});
