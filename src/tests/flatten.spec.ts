import { chain } from "../Chain";

describe("chain.flatten", () => {
    it("flattens arrays into separate items", async () => {
        const consumer = jest.fn();

        await chain([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
            .flatten()
            .consume(consumer);

        expect(consumer.mock.calls).toEqual([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
            [7],
            [8],
            [9],
            [10],
        ]);
    });
});
