import * as Types from "./types.js"


/**
 * @type {<T>(array: T[], items: T[]) => T[]}
*/
export function array_remove_items(array, items) {
    for (const item of items) {
        const index = array.indexOf(item);
        if (index > -1) { // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    return array
}

export function dev_focused() {
    return document.activeElement.classList.contains("dev-prevent-control")
}