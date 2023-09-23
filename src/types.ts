// TYPE DEFINITIONS

import { EditorView } from "@codemirror/view";

export interface Clipboard {
	element: HTMLElement | null;
	copy(): void;
	paste(): void;
}

export interface History {
	data: Node[];
	current_index: number;
	current(): Node;
	push(): void;
	undo(): void;
	redo(): void;
}


/** Client Storage: 
 * This object is used to store the state of the client's data.
 */
export interface ClientStorage {
	clipboard: Clipboard;
	history: History;
	body: HTMLElement | null;
	style: EditorView | null;
	animation: EditorView | null;
	script: EditorView | null;
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
	select(over_element: HTMLElement | Element): void;
	deselect(): void;
	unhover(): void;
	remove(): void;
}