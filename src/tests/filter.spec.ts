import { chain } from "../Chain";

describe("chain.filter", () => {
    it("calls a function for each item filtering out the items for which the function returns false", async () => {
        const consumer = jest.fn();

        await chain([1, 2, 3])
            .filter((item): item is number => item % 2 === 0)
            .consume(consumer);

        expect(consumer.mock.calls).toEqual([[2]]);
    });
});
