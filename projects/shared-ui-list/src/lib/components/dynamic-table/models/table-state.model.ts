export interface SelectionState {
  selectedIds: Set<string>;
  allElementsSelected: boolean;
  excludedElements: Set<string>;
}
