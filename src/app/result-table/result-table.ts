import { Component, computed, effect, input, linkedSignal, output, signal } from '@angular/core';
import { CartesianResult, ExtraColumn, TableResult } from '../models';
import { form, FormField } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { formatAsMarkdown } from '../formatters';

@Component({
  selector: 'app-result-table',
  imports: [JsonPipe, FormField],
  templateUrl: './result-table.html',
  styleUrl: './result-table.scss',
})
export class ResultTable {
  readonly useCheckColumn = input(true);
  readonly extraColumns = input<ExtraColumn[]>([]);
  readonly cartesianResult = input<CartesianResult | null>(null);
  readonly tableResult = output<TableResult>();
  protected readonly formData = linkedSignal(() => {
    const extras = Object.fromEntries(
      this.extraColumns().map((c) => [c.name, c.type === 'checkbox' ? false : '']),
    );
    return {
      items: (this.cartesianResult()?.items ?? []).map((result) => ({ result, extras })),
    };
  });
  protected readonly resultForm = form(this.formData);

  protected readonly labels = computed(() => {
    const r = this.cartesianResult();
    if (!r?.items?.[0]) {
      return [];
    }
    return Object.keys(r.items[0]);
  });

  constructor() {
    effect(() => this.tableResult.emit(this.formData()));
  }
}
