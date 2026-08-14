/// <reference lib="webworker" />

import { CartesianResult } from "./models";
import { computeResults } from "./compute";

const cache = new Map<string, CartesianResult>();

addEventListener('message', ({ data }) => {
  console.time('worker.' + data.id)
  const key = JSON.stringify(data)
  if (cache.has(key)) {
    const result = cache.get(key)
    console.timeEnd('worker')
    postMessage(result);
  } else {
    const result = computeResults(data)
    console.timeEnd('worker.' + data.id)
    postMessage(result);
    cache.set(key, result)
  }
});
