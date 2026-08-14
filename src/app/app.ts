import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { fields as formFields } from './form';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Cartesian } from './cartesian';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  form = new FormGroup({});
  model = {};
  fields = formFields;
  private service = inject(Cartesian);
  result = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    switchMap(x => this.service.compute(x as any))
  )

  onSubmit(model: any) {
    console.log(model);
  }
}
