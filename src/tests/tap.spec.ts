import { chain } from "../Chain";

describe("chain.tap", () => {
    it("calls a function for each item without changing items in the chain", async () => {
        const tapper = jest.fn();
        const tapper2 = jest.fn();

        await chain([1, 2, 3]).tap(tapper).tap(tapper2).consume();

        expect(tapper.mock.calls).toEqual([[1], [2], [3]]);
        expect(tapper2.mock.calls).toEqual([[1], [2], [3]]);
    });
});
