import { chain } from "../Chain";

describe("chain.batch", () => {
    it("groups items into batches", async () => {
        const result = await chain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .batch(3)
            .toArray();

        expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });
});
