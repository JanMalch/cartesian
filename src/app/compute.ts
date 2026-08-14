
import { CartesianRequest, CartesianResult, CartesianResultItem } from "./models";

export function computeResults(data: CartesianRequest): CartesianResult {
  const results = data.inputs.reduce((acc, input) => {
    const result = [];
    for (const obj of acc) {
      for (const value of input.values) {
        result.push({ ...obj, [input.label]: value });
      }
    }
    return result;
  }, [{} as Record<string, string>]);
  const items = results.flatMap(result => Object.entries(result).map(([label, value]) => ({ label, value })))
  return {
    id: data.id,
    items,
  };
}
