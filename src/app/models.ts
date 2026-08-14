export interface InputDefinition {
  readonly label: string;
  readonly values: string[];
}

export interface CartesianRequest {
  readonly id: number;
  readonly inputs: ReadonlyArray<InputDefinition>;
}

export interface CartesianResult {
  readonly id: number;
  readonly items: ReadonlyArray<CartesianResultItem>
}
export interface CartesianResultItem {
  readonly label: string;
  readonly value: string;
}
