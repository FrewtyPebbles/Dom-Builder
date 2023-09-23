// TYPE DEFINITIONS

/**
 * @typedef {Object} Clipboard
 * @property {HTMLElement | null} element The element in the clipboard.
 * @property {() => void} copy Coppies the selected element to the clipboard.
 * @property {() => void} paste Pastes the element in the clipboard into the selected element after its last child.
 */

/**
 * @typedef {Object} History
 * @property {Node[]} data Stores the dev body's history.
 * @property {number} current_index The current history index that represents the current state of the dev body.
 * @property {() => Node} current Returns the current history/state of the dev body within the history.
 * @property {() => void} push Appends the current state of the dev body to the history.
 * @property {() => void} undo Reverts to previous state of the dev body.
 * @property {() => void} redo Progresses to the next state of the dev body.
 */

/** Client Storage: 
 * This object is used to store the state of the client's data.
 * @typedef {Object} ClientStorage
 * @property {Clipboard} clipboard Handles copying and pasting of elements.
 * @property {History} history Handles undos and redos.
 * @property {HTMLElement | null} body A reference to the dev body. This is utilized in saving and loading.
 * @property {HTMLElement | null} style A reference to the dev style editor. This is utilized in saving and loading.
 * @property {HTMLElement | null} animation A reference to the dev animation editor. This is utilized in saving and loading.
 * @property {HTMLElement | null} script A reference to the dev script editor. This is utilized in saving and loading.
 * @property {() => void} save Saves the current state of the website to localstorage.
 * @property {() => void} load Loads the current state of the website from localstorage.
 * @property {() => Promise.<void>} export Exports the current state of the website to an html file.  This function is asyncronous.
 */

/** Selected Element
 * @typedef {Object} SelectedElement
 * @property {HTMLElement | null} element The currently selected element.
 * @property {boolean} selected Wether or not the element is currently selected.
 * @property {HTMLElement | null} drag_start_element The element the mouse was over at the start of a click and drag.
 * @property {HTMLElement | null} hovered_element The element that is currently being hovered over.
 * @property {(over_element:HTMLElement) => void} select Selects the element provided.
 * @property {() => void} deselect Deselects the selected element.
 * @property {() => void} unhover Unhovers the hovered element.
 * @property {() => void} remove Removes the selected element.
 */

export default {};