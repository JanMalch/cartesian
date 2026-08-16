import { Component, signal, inject, OnInit, computed, model } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { fields as formFields } from './form';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Cartesian } from './cartesian';
import { startWith, switchMap, tap, filter } from 'rxjs';
import { isCartesianInput, TableResult, ExtraColumn } from './models';
import { ResultTable } from './result-table/result-table';
import { formatAsAtlassian, formatAsMarkdown } from './formatters';
import { InputsFormComponent } from './inputs/inputs';
import { buildInputsSection, createInputsModel, Inputs } from './inputs/inputs.models';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    FormlyForm,
    JsonPipe,
    AsyncPipe,
    InputsFormComponent,
    ResultTable,
    MatButton,
    CdkCopyToClipboard,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly modex = signal({
    inputs: createInputsModel()(),
  });

  readonly forx = form(this.modex, (s) => {
    buildInputsSection(s.inputs);
  });

  updateInputs(inputs: Inputs) {
    this.modex.update((m) => ({ ...m, inputs }));
  }

  form = new FormGroup({});
  model = {};
  fields = formFields;
  private service = inject(Cartesian);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected tableResult = signal<TableResult | null>(null);
  readonly extraColumns = signal<ExtraColumn[]>([
    // FIXME: temporary
    { name: 'Valid?', type: 'checkbox', format: [] },
    { name: 'Meaning', type: 'text', format: ['bold'] },
  ]);
  protected markdown = computed(() => {
    const res = this.tableResult();
    return res ? formatAsMarkdown(this.extraColumns(), res.items) : '';
  });
  protected atlassian = computed(() => {
    const res = this.tableResult();
    return res ? formatAsAtlassian(this.extraColumns(), res.items) : '';
  });

  result = this.form.valueChanges.pipe(
    tap((x) => this.storeInUrl(x)),
    startWith(this.form.getRawValue()),
    filter(isCartesianInput),
    switchMap((x) => this.service.compute(x)),
  );

  ngOnInit(): void {
    // TODO: use ActivatedRoute?
    const params = new URL(window.location.href).searchParams;
    const raw = params.get('s');
    if (!raw) {
      return;
    }
    this.model = JSON.parse(atob(raw));
  }

  private storeInUrl(data: unknown) {
    // FIXME: put in the URL without creating backstack entry
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { s: btoa(JSON.stringify(data)) },
      queryParamsHandling: 'merge',
    });
  }

  onSubmit(model: any) {
    console.log(model);
  }
}
