export interface FormErrorSummaryField {
  readonly key: string;
  readonly label: string;
  readonly controlId?: string;
  readonly errorMessages?: Readonly<Record<string, string>>;
}

export interface FormErrorSummaryItem {
  readonly key: string;
  readonly label: string;
  readonly controlId: string;
  readonly message: string;
}
