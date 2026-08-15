import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { CartesianResult } from '../models';
import { form, FormField } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

export interface ExtraColumn {
  readonly name: string;
  readonly type: 'text' | 'checkbox';
}

@Component({
  selector: 'app-result-table',
  imports: [JsonPipe, FormField],
  templateUrl: './result-table.html',
  styleUrl: './result-table.scss',
})
export class ResultTable {

  readonly useCheckColumn = input(true);
  readonly extraColumns = input<ExtraColumn[]>([

    // FIXME: temporary
    { name: 'Valid?', type: 'checkbox' },
    { name: 'Meaning', type: 'text' },

  ]);
  readonly cartesianResult = input<CartesianResult | null>(null);
  protected readonly tableResult = linkedSignal(() => {
    const extras = Object.fromEntries(this.extraColumns().map(c => ([c.name, c.type === 'checkbox' ? false : ''])))
    return {
      // items: Array(this.cartesianResult()?.items ?? 0).fill(0).map(_ => ({ ...extras }))
      items: (this.cartesianResult()?.items ?? []).map(result => ({ result, extras }))
    }
  })
  protected readonly resultForm = form(this.tableResult);

  protected readonly labels = computed(() => {
    const r = this.cartesianResult();
    if (!r?.items?.[0]) {
      return [];
    }
    return Object.keys(r.items[0]);
  });

}
