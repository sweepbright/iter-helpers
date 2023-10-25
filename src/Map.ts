import { Iter } from "./Iter";
import { Operator } from "./Operator";

export function map<Input, Output, ErrorOutput = never>(
    mapper: (input: Input) => Output | Promise<Output>,
    errorMapper?: (
        input: Input,
        error: unknown
    ) => ErrorOutput | Promise<ErrorOutput>
): Operator<Input, Output | ErrorOutput> {
    return async function* mapOperator(input: Iter<Input>): Iter<Output> {
        for await (const value of input) {
            let result: Output;
            try {
                result = await mapper(value);
            } catch (error) {
                if (!errorMapper) {
                    throw error;
                }
                yield await errorMapper(value, error);
                continue;
            }
            yield result;
        }
    };
}
