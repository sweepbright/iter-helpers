import { chain } from "../Chain";

describe("chain.map", () => {
    it("calls a function for each item returning the transformed item", async () => {
        const consumer = jest.fn();

        await chain([1, 2, 3])
            .map((item) => item * 2)
            .consume(consumer);

        expect(consumer.mock.calls).toEqual([[2], [4], [6]]);
    });
});
