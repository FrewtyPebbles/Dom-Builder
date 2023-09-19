import { DEV_BODY } from "./dev_bar.js"

export var selected_element = {element:DEV_BODY, selected:false, editing:false, drag_start_element:DEV_BODY}

export var hovered_element = DEV_BODY

/// Mouse Event Handlers
function unhover() {
    [
        "center",
        "top",
        "bottom",
        "left",
        "right"
    ].forEach(pos => {
        while (hovered_element?.classList.contains(`dev-hover-${pos}`)) {
            hovered_element?.classList.remove(`dev-hover-${pos}`)
        }
    })
}

function deselect() {
    let allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        while (element?.classList.contains('dev-selected')) {
            element?.classList.remove('dev-selected')
        }
    })
    change_content_editable(selected_element.element, false)
    selected_element.editing = false
    selected_element.selected = false
}

function select_element(over_element) {
     // guard: already selected
    if (over_element === selected_element.element) return;
    deselect()
    selected_element.element = over_element
    selected_element.selected = true
    selected_element.element?.classList.add('dev-selected')
}

function all_descendants(node, callback) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      all_descendants(child, callback);
      callback(child);
    }
}

function change_content_editable(node, editable) {
    node.contentEditable = editable
    all_descendants(node, () => node.contentEditable = editable)
}

// Mouse Down - Get start position of element drag
document.addEventListener('mousedown', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (over_element.getAttribute('contenteditable') === true) return;
    if (!DEV_BODY.contains(over_element)) return;
    if (selected_element.element.contains(over_element) && selected_element.editing === true) return;
    select_element(over_element)
    if (selected_element.editing === true) return;
    selected_element.drag_start_element = document.elementFromPoint(e.clientX, e.clientY)
})

// Mouse Double Click - edit content
document.addEventListener('dblclick', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (!DEV_BODY.contains(over_element)) return;
    if (over_element.classList.contains('dev-selected')) {
        // guard to deselect if already selected
        change_content_editable(selected_element.element, true)
        selected_element.editing = true
        return
    }
    select_element(over_element)
    change_content_editable(selected_element.element, true)
    selected_element.editing = true
})

// Mouse Over
document.addEventListener('mousemove', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (!DEV_BODY.contains(over_element)) {unhover(); return};
    if (over_element.classList.contains('dev-hover')) {
        // guard to deselect if already selected
        unhover()
        return
    }
    unhover()
    hovered_element = over_element
    let drop_position = get_drop_position(over_element, e.clientX, e.clientY)
    hovered_element?.classList.add(`dev-hover-${drop_position}`)
    //console.log(hovered_element?.classList);
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
    if (selected_element.editing === true) return;
    
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
})

function get_drop_position(over_element, mousex, mousey) {
    if (over_element.childNodes.length <= 0) return "center";
    let rect = over_element.getBoundingClientRect()
    let mouse_pos = {x:mousex, y:mousey}
    let elem_bounds = {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        x: rect.x,
        y: rect.y,
        height: rect.height,
        width: rect.width
    }
    let local_mouse_pos = {x:mouse_pos.x-elem_bounds.x, y:mouse_pos.y-elem_bounds.y}
    
    if (local_mouse_pos.y < elem_bounds.height/4) return "top";
    if (local_mouse_pos.y > elem_bounds.height*3/4) return "bottom";
    if (local_mouse_pos.x > elem_bounds.width*3/4) return "right";
    if (local_mouse_pos.x < elem_bounds.width/4) return "left";
    return "center";

}