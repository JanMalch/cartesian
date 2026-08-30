import { Component, computed, input, model, output, WritableSignal } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { Inputs } from './inputs.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-inputs',
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButton, MatIconButton, MatIcon],
  templateUrl: './inputs.html',
  styleUrl: './inputs.scss',
})
export class InputsFormComponent {
  readonly form = input.required<FieldTree<Inputs>>();
  readonly model = model.required<Inputs>();

  protected readonly addInputDisabled = computed(() => this.model().some((x) => !x.label?.trim()));

  protected addInput() {
    // TODO: focus "input label" input element
    this.model.update((x) => [
      ...x,
      {
        label: '',
        values: ['true', 'false'],
      },
    ]);
  }

  protected addValue(i: number) {
    this.model.update((x) => {
      const copy = [...x];
      copy[i] = { label: copy[i].label, values: [...copy[i].values, ''] };
      return copy;
    });
  }

  protected removeInput(i: number) {
    this.model.update((x) => removeAt(x, i));
  }

  protected removeValue(i: number, j: number) {
    this.model.update((x) => {
      const copy = [...x];
      copy[i] = { label: copy[i].label, values: removeAt(copy[i].values, j) };
      return copy;
    });
  }
}

function removeAt<T>(array: ReadonlyArray<T>, index: number): T[] {
  const copy = [...array];
  copy.splice(index, 1);
  return copy;
}
