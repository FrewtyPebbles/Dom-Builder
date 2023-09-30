import * as Types from "#types";

import CLIENT_STORAGE from "#state/client_storage";
import DEV from "#state/gui";
import { ASSET_TYPE_LIST } from "#state/classes/Asset";

export const VOID_TYPE_LIST = [
    "IMG",
    "INPUT",
    "AREA",
    "BASE",
    "BR",
    "COL",
    "EMBED",
    "HR",
    "SOURCE",
    "TRACK",
    "WBR"
];

export function array_remove_items<T>(array: T[], items: T[]): T[] {
    for (const item of items) {
        const index = array.indexOf(item);
        if (index > -1) { // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    return array
}

export function dev_focused(): boolean {
    return document.activeElement.classList.contains("dev-prevent-control") || DEV.editor_focused
}

function all_descendants(node:HTMLElement | ChildNode, callback:(child: ChildNode) => string): void {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      all_descendants(child, callback);
      callback(child);
    }
}

export function as_bool(str:string):boolean {
    return str.toLowerCase() === "true"
}

export function as_string(val:any):string {
    return `${val}`
}

export function change_content_editable(node:HTMLElement | Element, editable:boolean): void {
    if (ASSET_TYPE_LIST.includes(node.tagName.toLowerCase())) return
    // Save the state if the content editable value is being changed
    if (editable !== as_bool((node as HTMLElement).contentEditable)) CLIENT_STORAGE.history.push();
    
    (node as HTMLElement).contentEditable = as_string(editable)
    
    all_descendants(node, () => (node as HTMLElement).contentEditable = as_string(editable))
}

export function get_drop_position(over_element:Element, mousex:number, mousey:number): string {
    if (over_element.childNodes.length <= 0 && !VOID_TYPE_LIST.includes(over_element.tagName))
        return "center";// if the element has no notes and is not one of these tags return "center"
    let rect = over_element.getBoundingClientRect()
    let mouse_pos = {x:mousex, y:mousey}
    let local_mouse_pos = {x:mouse_pos.x-rect.x, y:mouse_pos.y-rect.y}
    
    if (local_mouse_pos.y < 10) return "top";
    if (local_mouse_pos.y > rect.height - 10) return "bottom";
    if (local_mouse_pos.x > rect.width - 10) return "right";
    if (local_mouse_pos.x < 10) return "left";
    if (!VOID_TYPE_LIST.includes(over_element.tagName)) return "center";
    return "bottom"; // this guard avoids placing children in void elements
}