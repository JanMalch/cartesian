import { ExtraColumn } from '../models';
import { signal } from '@angular/core';
import { required, minLength, SchemaPathTree } from '@angular/forms/signals';

export type ExtraColumns = ExtraColumn[];

export function createExtrasModel() {
  return signal<ExtraColumns>([
    {
      name: 'Valid?',
      type: 'checkbox',
      format: [],
    },
    {
      name: 'Meaning',
      type: 'text',
      format: [],
    },
  ]);
}

export function buildExtrasSection(a: SchemaPathTree<ExtraColumns>) {
  required(a, { message: 'Extras are required' });
  minLength(a, 1, { message: 'Need at least one extra' });
}
