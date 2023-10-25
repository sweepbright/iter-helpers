import { chain } from "../Chain";

describe("chain.batch", () => {
    it("groups items into batches", async () => {
        const consumer = jest.fn();

        await chain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).batch(3).consume(consumer);

        expect(consumer.mock.calls).toEqual([
            [[1, 2, 3]],
            [[4, 5, 6]],
            [[7, 8, 9]],
            [[10]],
        ]);
    });
});
