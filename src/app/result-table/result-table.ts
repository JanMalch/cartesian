import { Component, computed, effect, input, linkedSignal, output } from '@angular/core';
import { CartesianResult, ExtraColumn, TableResult } from '../models';
import { form, FormField } from '@angular/forms/signals';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ResultCache } from './result-cache';

@Component({
  selector: 'app-result-table',
  imports: [
    FormField,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    CdkTextareaAutosize,
  ],
  templateUrl: './result-table.html',
  styleUrl: './result-table.scss',
})
export class ResultTable {
  private readonly cache = new ResultCache();

  readonly useCheckColumn = input(true);
  readonly extraColumns = input<ExtraColumn[]>([]);
  readonly cartesianResult = input<CartesianResult | null>(null);
  readonly tableResult = output<TableResult>();
  protected readonly formData = linkedSignal(() => {
    const results = this.cartesianResult()?.items ?? [];
    const extras = Object.fromEntries(
      this.extraColumns().map((c) => [c.name, c.type === 'checkbox' ? false : '']),
    );
    return {
      items: results.map((result) => {
        const cached = this.cache.get(result);
        return { result, extras: { ...extras, ...cached } };
      }),
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

  protected readonly gridTemplate = computed(() => {
    let result = `auto repeat(${this.labels().length}, auto) auto `;
    for (const extra of this.extraColumns()) {
      result += extra.type === 'checkbox' ? 'auto ' : '1fr ';
    }
    return result;
  });

  constructor() {
    effect(() => {
      const data = this.formData();
      data.items.forEach(({ result, extras }) => {
        this.cache.set(result, extras);
      });
      return this.tableResult.emit(data);
    });
  }
}
