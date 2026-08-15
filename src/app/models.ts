export interface InputDefinition {
  readonly label: string;
  readonly values: string[];
}

export interface CartesianRequest {
  readonly id: number;
  readonly inputs: ReadonlyArray<InputDefinition>;
}

export function isCartesianInput(value: unknown): value is Omit<CartesianRequest, 'id'> {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  return Array.isArray((value as any).inputs);
}

export interface CartesianResult {
  readonly id: number;
  readonly items: ReadonlyArray<CartesianResultItem>;
}
export interface CartesianResultItem {
  readonly [label: string]: string;
}

export interface ExtraColumn {
  readonly name: string;
  readonly type: 'text' | 'checkbox';
  readonly format: Array<'bold' | 'italic'>;
}

export interface TableResultItem {
  readonly result: Record<string, string>;
  readonly extras: Record<string, string | boolean>;
}

export interface TableResult {
  readonly items: ReadonlyArray<TableResultItem>;
}
