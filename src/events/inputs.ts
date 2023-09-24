import DEV from "#state/gui"

import { change_content_editable, get_drop_position, as_bool, as_string, dev_focused } from "#utility"

import CLIENT_STORAGE from "#state/client_storage"
import SELECTED_ELEMENT from "#state/selected_element"

/// Mouse Event Handlers

// Mouse Down - Get start position of element drag
document.addEventListener('mousedown', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (over_element.getAttribute('contenteditable') === as_string(true)) return;
    if (!DEV.body.contains(over_element)) return;
    if (SELECTED_ELEMENT.element.contains(over_element) && SELECTED_ELEMENT.element.contentEditable === as_string(true)) return;
    
    //select the element
    SELECTED_ELEMENT.select(over_element)
    
    if (SELECTED_ELEMENT.element.contentEditable === as_string(true)) return;
    
    SELECTED_ELEMENT.drag_start_element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
})

// Mouse Double Click - edit content
document.addEventListener('dblclick', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (!DEV.body.contains(over_element) || over_element === DEV.body) return;
    if (SELECTED_ELEMENT.selected && SELECTED_ELEMENT.element === over_element) {
        // guard to deselect if already selected
        change_content_editable(SELECTED_ELEMENT.element, true)
        return
    }
    change_content_editable(SELECTED_ELEMENT.element, true)
})

// Mouse Over
document.addEventListener('mousemove', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (over_element === DEV.body) return;
    if (!DEV.body.contains(over_element)) {SELECTED_ELEMENT.unhover(); return};
    if (over_element.classList.contains('dev-hover')) {
        // guard to deselect if already selected
        SELECTED_ELEMENT.unhover()
        return
    }
    SELECTED_ELEMENT.unhover()
    SELECTED_ELEMENT.hovered_element = over_element as HTMLElement
    let drop_position = get_drop_position(over_element, e.clientX, e.clientY)
    SELECTED_ELEMENT.hovered_element?.classList.add(`dev-hover-${drop_position}`)
    //console.log(SELECTED_ELEMENT.hovered_element?.classList);
})

// Mouse Up
document.addEventListener('mouseup', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    // guard against appending to selected element
    if (over_element === SELECTED_ELEMENT.element || SELECTED_ELEMENT.selected === false) return;
    // guard against moving into element inside selected element
    //console.log(SELECTED_ELEMENT);
    //console.log(SELECTED_ELEMENT.element.contains(over_element));
    if (SELECTED_ELEMENT.element.contains(over_element)) return;
    // guard against dragging out of dev body
    if (!DEV.body.contains(over_element)) return;
    // guard against dragging from the wrong node
    if (SELECTED_ELEMENT.element !== SELECTED_ELEMENT.drag_start_element) return;
    // guard against moving while editing content
    if (SELECTED_ELEMENT.element.contentEditable === as_string(true)) return;
    
    // Get placement position
    let drop_position = get_drop_position(over_element, e.clientX, e.clientY)
    // End Get placement position

    // apend to the element it was dragged to
    let moved_element = SELECTED_ELEMENT.element.cloneNode(true)
    

    // Place Element
    switch (drop_position) {
        case "top":
            over_element.insertAdjacentElement("beforebegin", moved_element as Element)
            break;

        case "bottom":
            over_element.insertAdjacentElement("afterend", moved_element as Element)
            break;

        case "left":
            over_element.insertAdjacentElement("beforebegin", moved_element as Element)
            break;

        case "right":
            over_element.insertAdjacentElement("afterend", moved_element as Element)
            break;

        case "center":
            over_element.insertAdjacentElement("beforeend", moved_element as Element)
            break;
    }
    SELECTED_ELEMENT.element.remove()
    SELECTED_ELEMENT.element = DEV.body
    
    // End Place Element
    CLIENT_STORAGE.history.push()
})

document.addEventListener("copy", e => {
    if (as_bool(SELECTED_ELEMENT.element.contentEditable)) return
    CLIENT_STORAGE.clipboard.copy()
})

document.addEventListener("paste", e => {
    if (as_bool(SELECTED_ELEMENT.element.contentEditable)) return
    CLIENT_STORAGE.clipboard.paste()
    CLIENT_STORAGE.history.push()
})

// Keyboard Input
document.addEventListener("keydown", e => {
    if (e.key === "Z" && e.ctrlKey) { // Redo
        CLIENT_STORAGE.history.redo()
    }
    else if (e.key === "z" && e.ctrlKey) { // Undo
        CLIENT_STORAGE.history.undo()
    }
    else if (e.key === "Delete") { // Delete
        if (dev_focused()) return
        SELECTED_ELEMENT.remove()
        CLIENT_STORAGE.history.push()
    }
})