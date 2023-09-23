import * as Types from "./types.js";

import CLIENT_STORAGE from "./state/client_storage.js";


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

/** @type {() => boolean} */
export function dev_focused() {
    return document.activeElement.classList.contains("dev-prevent-control")
}

/** @type {(node:HTMLElement | ChildNode, callback:(child: ChildNode) => string) => void} */
function all_descendants(node, callback) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      all_descendants(child, callback);
      callback(child);
    }
}

/** @type {(node:HTMLElement, editable:boolean) => void} */
export function change_content_editable(node, editable) {

    // Save the state if the content editable value is being changed
    if (editable !== node.contentEditable) CLIENT_STORAGE.history.push()
    
    node.contentEditable = editable
    
    all_descendants(node, () => node.contentEditable = editable)
}

/** @type {(over_element:HTMLElement, mousex:number, mousey:number) => string} */
export function get_drop_position(over_element, mousex, mousey) {
    if (over_element.childNodes.length <= 0) return "center";
    let rect = over_element.getBoundingClientRect()
    let mouse_pos = {x:mousex, y:mousey}
    let local_mouse_pos = {x:mouse_pos.x-rect.x, y:mouse_pos.y-rect.y}
    
    if (local_mouse_pos.y < 5) return "top";
    if (local_mouse_pos.y > rect.height - 5) return "bottom";
    if (local_mouse_pos.x > rect.width - 5) return "right";
    if (local_mouse_pos.x < 5) return "left";
    return "center";
}

/** @type {(ev: Event) => void} */
export function tab_to_indent(ev) {
    if (ev.key == 'Tab') {
        ev.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart =
        this.selectionEnd = start + 1;
    }
}