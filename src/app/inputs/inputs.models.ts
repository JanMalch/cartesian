import { InputDefinition } from '../models';
import { signal } from '@angular/core';
import { required, minLength, pattern, SchemaPathTree } from '@angular/forms/signals';

export type Inputs = InputDefinition[];

export function createInputsModel() {
  return signal<Inputs>([
    {
      label: 'a',
      values: ['false', 'true'],
    },
    {
      label: 'b',
      values: ['false', 'true'],
    },
  ]);
}

export function buildInputsSection(a: SchemaPathTree<Inputs>) {
  required(a, { message: 'Inputs are required' });
  minLength(a, 2, { message: 'Need at least two inputs' });
}
