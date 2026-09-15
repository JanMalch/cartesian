import { Component, signal, inject, OnInit, computed, resource } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Cartesian } from './cartesian';
import { TableResult, ExtraColumn } from './models';
import { ResultTable } from './result-table/result-table';
import { formatAsAtlassian, formatAsMarkdown } from './formatters';
import { InputsFormComponent } from './inputs/inputs';
import { buildInputsSection, createInputsModel, Inputs } from './inputs/inputs.models';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, InputsFormComponent, ResultTable, MatButton, CdkCopyToClipboard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly model = signal({
    inputs: createInputsModel()(),
  });

  readonly form = form(this.model, (s) => {
    buildInputsSection(s.inputs);
  });

  // TODO: with previous value? https://angular.dev/guide/signals/resource#composing-resources-with-snapshots
  readonly result = resource({
    params: () => ({ inputs: this.model() }),
    loader: ({ params }) => this.service.compute(params.inputs),
  });

  updateInputs(inputs: Inputs) {
    this.model.update((m) => ({ ...m, inputs }));
  }

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

  ngOnInit(): void {
    // TODO: use ActivatedRoute?
    const params = new URL(window.location.href).searchParams;
    const raw = params.get('s');
    if (!raw) {
      return;
    }
    // FIXME = JSON.parse(atob(raw));
  }

  private storeInUrl(data: unknown) {
    // FIXME: put in the URL without creating backstack entry
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { s: btoa(JSON.stringify(data)) },
      queryParamsHandling: 'merge',
    });
  }
}
