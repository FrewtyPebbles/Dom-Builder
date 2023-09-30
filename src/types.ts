// TYPE DEFINITIONS

import Asset from "#state/classes/Asset";
import History from "#state/classes/History";
import { EditorView } from "@codemirror/view";

export interface Clipboard {
	element: HTMLElement | null;
	element_reference: HTMLElement | null;
	copy(): void;
	paste(): void;
}

export interface HistorySection {
	data: History[];
	current_index: number;
	current(): History;
	push(): void;
	undo(): void;
	redo(): void;
}

export interface Assets {
	data: Asset[];
	push(file:File, name:string): void;
	find_from_dev_src(src:string): Asset | null;
	find_from_export_src(src:string): Asset | null;
}


/** Client Storage: 
 * This object is used to store the state of the client's data.
 */
export interface ClientStorage {
	clipboard: Clipboard;
	history: HistorySection;
	body: HTMLElement | null;
	style: EditorView | null;
	animation: EditorView | null;
	script: EditorView | null;
	assets: Assets;
	save(): void;
	load(): void;
	export(): void;
}

/** Selected Element
 */
export interface SelectedElement {
	element: HTMLElement | null;
	selected: boolean;
	drag_start_element: HTMLElement | null;
	hovered_element: HTMLElement | null;
	select(element: HTMLElement | Element | null): void;
	deselect(): void;
	unhover(): void;
	remove(): void;
	/** Function returns the selected parent unless the parent is body.  
     * If the parent is dev-body, it returns the currently selected element.
     */
	select_parent(): HTMLElement;
}