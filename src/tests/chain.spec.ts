import { chain } from "../Chain";

describe("chain", () => {
    it("consumes an array", async () => {
        const consumer = jest.fn();

        await chain([1, 2, 3]).consume(consumer);

        expect(consumer.mock.calls).toEqual([[1], [2], [3]]);
    });

    it("consumes an async iterator", async () => {
        async function* generate() {
            yield 1;
            yield 2;
            yield 3;
        }

        const consumer = jest.fn();

        await chain(generate()).consume(consumer);

        expect(consumer.mock.calls).toEqual([[1], [2], [3]]);
    });

    describe("toArray", () => {
        it("consumes an async generator to array", async () => {
            async function* generate() {
                yield 1;
                yield 2;
                yield 3;
            }

            expect(await chain(generate()).toArray()).toEqual([1, 2, 3]);
        });
    });
});
