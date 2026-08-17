export interface FormCompletionField {
  readonly key: string;
  readonly label: string;
  readonly required?: boolean;
}

export type FormCompletionSummaryFormatter = (
  completed: number,
  total: number,
  percentage: number,
) => string;
