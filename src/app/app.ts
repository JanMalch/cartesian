import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { fields as formFields } from './form';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Cartesian } from './cartesian';
import { startWith, switchMap, tap, filter } from 'rxjs';
import { isCartesianInput } from './models';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  form = new FormGroup({});
  model = {};
  fields = formFields;
  private service = inject(Cartesian);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  result = this.form.valueChanges.pipe(
    tap(x => this.storeInUrl(x)),
    startWith(this.form.getRawValue()),
    filter(isCartesianInput),
    switchMap(x => this.service.compute(x))
  )

  ngOnInit(): void {
    // TODO: use ActivatedRoute?
    const params = new URL(window.location.href).searchParams;
    const raw = params.get('s');
    if (!raw) {
      return
    }
    this.model = JSON.parse(atob(raw));
  }

  private storeInUrl(data: unknown) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { s: btoa(JSON.stringify(data)) },
      queryParamsHandling: "merge",
    });
  }

  onSubmit(model: any) {
    console.log(model);
  }
}
