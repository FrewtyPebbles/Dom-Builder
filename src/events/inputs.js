import { DEV_BODY, DEV_PROPERTIES_CLASSES, DEV_PROPERTIES_ID } from "../state/elements.js"
import { array_remove_items, change_content_editable, get_drop_position } from "../utility.js"

import { client_storage, selected_element } from "../state/state.js"

/// Mouse Event Handlers

// Mouse Down - Get start position of element drag
document.addEventListener('mousedown', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (over_element.getAttribute('contenteditable') === true) return;
    if (!DEV_BODY.contains(over_element)) return;
    if (selected_element.element.contains(over_element) && selected_element.element.contentEditable === true) return;
    
    //select the element
    selected_element.select(over_element)

    //Remove dev classes from properties editor
    DEV_PROPERTIES_CLASSES.value = array_remove_items(
        [...selected_element.element.classList.values()],
        [
            "dev-selected", 
            "dev-hover-center",
            "dev-hover-top",
            "dev-hover-bottom",
            "dev-hover-left",
            "dev-hover-right"
        ]
    ).join(" ")
    
    //set properties id value
    DEV_PROPERTIES_ID.value = selected_element.element.id
    
    if (selected_element.element.contentEditable === true) return;
    
    selected_element.drag_start_element = document.elementFromPoint(e.clientX, e.clientY)
})

// Mouse Double Click - edit content
document.addEventListener('dblclick', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (!DEV_BODY.contains(over_element) || over_element === DEV_BODY) return;
    if (selected_element.selected && selected_element.element === over_element) {
        // guard to deselect if already selected
        change_content_editable(selected_element.element, true)
        return
    }
    change_content_editable(selected_element.element, true)
})

// Mouse Over
document.addEventListener('mousemove', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (over_element === DEV_BODY) return;
    if (!DEV_BODY.contains(over_element)) {selected_element.unhover(); return};
    if (over_element.classList.contains('dev-hover')) {
        // guard to deselect if already selected
        selected_element.unhover()
        return
    }
    selected_element.unhover()
    selected_element.hovered_element = over_element
    let drop_position = get_drop_position(over_element, e.clientX, e.clientY)
    selected_element.hovered_element?.classList.add(`dev-hover-${drop_position}`)
    //console.log(selected_element.hovered_element?.classList);
})

// Mouse Up
document.addEventListener('mouseup', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    // guard against appending to selected element
    if (over_element === selected_element.element || selected_element.selected === false) return;
    // guard against moving into element inside selected element
    //console.log(selected_element);
    //console.log(selected_element.element.contains(over_element));
    if (selected_element.element.contains(over_element)) return;
    // guard against dragging out of dev body
    if (!DEV_BODY.contains(over_element) || DEV_BODY == over_element) return;
    // guard against dragging from the wrong node
    if (selected_element.element !== selected_element.drag_start_element) return;
    // guard against moving while editing content
    if (selected_element.element.contentEditable === true) return;
    
    // Get placement position
    let drop_position = get_drop_position(over_element, e.clientX, e.clientY)
    // End Get placement position

    // apend to the element it was dragged to
    let moved_element = selected_element.element.cloneNode(true)
    

    // Place Element
    switch (drop_position) {
        case "top":
            over_element.insertAdjacentElement("beforebegin", moved_element)
            break;

        case "bottom":
            over_element.insertAdjacentElement("afterend", moved_element)
            break;

        case "left":
            over_element.insertAdjacentElement("beforebegin", moved_element)
            break;

        case "right":
            over_element.insertAdjacentElement("afterend", moved_element)
            break;

        case "center":
            over_element.insertAdjacentElement("beforeend", moved_element)
            break;
    }
    selected_element.element.remove()
    selected_element.element = DEV_BODY
    
    // End Place Element
    client_storage.history.push()
})

document.addEventListener("copy", e => {
    client_storage.clipboard.copy()
})

document.addEventListener("paste", e => {
    client_storage.clipboard.paste()
    client_storage.history.push()
})

// Keyboard Input
document.addEventListener("keydown", e => {
    if (e.key === "Z" && e.ctrlKey) { // Redo
        client_storage.history.redo()
    }
    else if (e.key === "z" && e.ctrlKey) { // Undo
        client_storage.history.undo()
    }
})