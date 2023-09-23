import * as Types from "#types";

import CLIENT_STORAGE from "#state/client_storage";
import DEV from "#state/gui";



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

    // Save the state if the content editable value is being changed
    if (editable !== as_bool((node as HTMLElement).contentEditable)) CLIENT_STORAGE.history.push();
    
    (node as HTMLElement).contentEditable = as_string(editable)
    
    all_descendants(node, () => (node as HTMLElement).contentEditable = as_string(editable))
}

export function get_drop_position(over_element:Element, mousex:number, mousey:number): string {
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