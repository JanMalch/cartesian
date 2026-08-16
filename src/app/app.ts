import { Component, signal, inject, OnInit, computed, model, resource } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Cartesian } from './cartesian';
import { startWith, switchMap, tap, filter } from 'rxjs';
import { isCartesianInput, TableResult, ExtraColumn } from './models';
import { ResultTable } from './result-table/result-table';
import { formatAsAtlassian, formatAsMarkdown } from './formatters';
import { InputsFormComponent } from './inputs/inputs';
import { buildInputsSection, createInputsModel, Inputs } from './inputs/inputs.models';
import { linkedSignal, resourceFromSnapshots, Resource, ResourceSnapshot } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, InputsFormComponent, ResultTable, MatButton, CdkCopyToClipboard],
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

  // TODO: with previous value? https://angular.dev/guide/signals/resource#composing-resources-with-snapshots
  readonly result = resource({
    params: () => ({ inputs: this.modex() }),
    loader: ({ params }) => this.service.compute(params.inputs),
  });

  updateInputs(inputs: Inputs) {
    this.modex.update((m) => ({ ...m, inputs }));
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
