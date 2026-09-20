import { Component, computed, input, model, output, WritableSignal } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { ExtraColumns } from './extras.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-extras',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatSelectModule,
  ],
  templateUrl: './extras.html',
  styleUrl: './extras.scss',
})
export class ExtraColumnsFormComponent {
  readonly form = input.required<FieldTree<ExtraColumns>>();
  readonly model = model.required<ExtraColumns>();

  protected readonly addExtraDisabled = computed(() => this.model().some((x) => !x.name?.trim()));

  protected addExtra() {
    // TODO: focus "name" input element
    this.model.update((x) => [
      ...x,
      {
        name: '',
        type: 'text',
        format: [],
      },
    ]);
  }

  protected removeInput(i: number) {
    this.model.update((x) => removeAt(x, i));
  }
}

function removeAt<T>(array: ReadonlyArray<T>, index: number): T[] {
  const copy = [...array];
  copy.splice(index, 1);
  return copy;
}
