import { Service } from '@angular/core';
import { CartesianRequest, CartesianResult } from './models';
import { filter, Observable, firstValueFrom } from 'rxjs';
import { computeResults } from './compute';

@Service()
export class Cartesian {

  private worker?: Worker;
  private results?: Observable<CartesianResult>;
  readonly supportsWorker = typeof Worker !== 'undefined';

  constructor() {

    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      this.results = new Observable((subscriber) => {
        worker.onmessage = ({ data }) => {
          subscriber.next(data)
        };
      });
      this.worker = worker;
    }
  }

  async compute(data: Omit<CartesianRequest, 'id'>): Promise<CartesianResult> {
    const id = Math.random();
    const request = { ...data, id }
    if (!this.worker || !this.results) {
      return new Promise(resolve => requestAnimationFrame(resolve)).then(() => computeResults(request))
    }
    this.worker.postMessage(request);
    return firstValueFrom(this.results.pipe(
      filter(x => x.id === id)
    ))
  }


}
