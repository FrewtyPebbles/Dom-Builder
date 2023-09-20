

/** Client Storage
 * @typedef {Object} ClientStorage
 * @property {{
 *  element: HTMLElement | null,
 *  copy:() => void,
 *  paste:() => void
 * }} clipboard
 * @property {string[]} history
 * @property {HTMLElement | null} body
 * @property {HTMLElement | null} style
 * @property {HTMLElement | null} animation
 * @property {HTMLElement | null} script
 * @property {() => void} save
 * @property {() => void} load
 */

/** Selected Element
 * @typedef {Object} SelectedElement
 * @property {HTMLElement | null} element
 * @property {boolean} selected
 * @property {HTMLElement | null} drag_start_element
 * @property {HTMLElement | null} hovered_element
 */

export default {};