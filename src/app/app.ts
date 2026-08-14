import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { fields as formFields } from './form';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, FormlyForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  form = new FormGroup({});
  model = {};
  fields = formFields;

  onSubmit(model: any) {
    console.log(model);
  }
}
