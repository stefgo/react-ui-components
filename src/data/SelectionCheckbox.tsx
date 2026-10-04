import { Checkbox } from '../Checkbox';
import type { RowSelection } from './useDataView';

export interface SelectionCheckboxProps<T> {
    item: T;
    selection: RowSelection<T>;
}

/**
 * The checkbox in front of a row, the same in all three views. A row that
 * cannot be picked gets nothing: a disabled box would still be announced, and
 * would say only that something is not possible here.
 *
 * It is an `<input>`, so the row's own click and keyboard activation leave it
 * alone (`rowActivationProps`): picking a row does not open it.
 */
export const SelectionCheckbox = <T,>({ item, selection }: SelectionCheckboxProps<T>) => {
    if (!selection.isSelectable(item)) return null;
    return (
        <Checkbox
            aria-label={selection.label(item)}
            checked={selection.isSelected(item)}
            onChange={() => selection.toggle(item)}
        />
    );
};
