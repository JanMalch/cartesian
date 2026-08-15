import { CartesianRequest, CartesianResult, CartesianResultItem } from './models';

export function computeResults(data: CartesianRequest): CartesianResult {
  const items = data.inputs.reduce(
    (acc, input) => {
      const result = [];
      for (const obj of acc) {
        for (const value of input.values) {
          result.push({ ...obj, [input.label]: value });
        }
      }
      return result;
    },
    [{} as Record<string, string>],
  );

  return {
    id: data.id,
    items,
  };
}
