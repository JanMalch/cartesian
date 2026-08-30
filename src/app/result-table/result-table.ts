import { Component, computed, effect, input, linkedSignal, output } from '@angular/core';
import { CartesianResult, ExtraColumn, TableResult } from '../models';
import { form, FormField } from '@angular/forms/signals';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

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

  protected readonly gridTemplate = computed(() => {
    let result = `repeat(${this.labels().length}, auto) auto `;
    for (const extra of this.extraColumns()) {
      result += extra.type === 'checkbox' ? 'auto ' : '1fr ';
    }
    return result;
  });

  constructor() {
    effect(() => this.tableResult.emit(this.formData()));
  }
}
