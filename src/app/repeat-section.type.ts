import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { FormlyField } from '@ngx-formly/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div>
      @if (props.label) {
        <legend>{{ props.label }}</legend>
      }
      @if (props.description) {
        <p>{{ props.description }}</p>
      }
      @for (field of field.fieldGroup; let i = $index; track i) {
      <div>
        <formly-field [field]="field"></formly-field>
        <div>
          <button matIconButton type="button" (click)="remove(i)">
            <mat-icon>remove</mat-icon>
          </button>
        </div>
      </div>
      }
      <div>
        <button matButton type="button" (click)="add()">{{ props['addText'] }}</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormlyField, MatIconModule, MatButtonModule],
})
export class RepeatTypeComponent extends FieldArrayType { }

