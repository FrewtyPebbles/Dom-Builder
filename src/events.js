export const DEV_BAR = document.getElementById('dev-bar')
export const DEV_BODY = document.getElementById('dev-body')

export var selected_element = {element:DEV_BODY, selected:false, editing:false, drag_start_element:DEV_BODY}

export var hovered_element = DEV_BODY

/// Mouse Event Handlers
function unhover() {
    while (hovered_element?.classList.contains('dev-hover')) {
        hovered_element?.classList.remove('dev-hover')
    }
}

function deselect() {
    let allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        while (element?.classList.contains('dev-selected')) {
            element?.classList.remove('dev-selected')
        }
    })
    selected_element.element.contentEditable = false
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

// Mouse Click
document.addEventListener('click', e => {
    // let over_element = document.elementFromPoint(e.clientX, e.clientY)
    // if (over_element.getAttribute('contenteditable') === true) return;
    // if (!DEV_BODY.contains(over_element)) return;
    // // if (over_element.classList.contains('dev-selected')) {
    // //     // guard to deselect if already selected
    // //     deselect()
    // //     return
    // // }
    // select_element(over_element)
})

// Mouse Down - Get start position of element drag
document.addEventListener('mousedown', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (over_element.getAttribute('contenteditable') === true) return;
    if (!DEV_BODY.contains(over_element)) return;
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
        selected_element.element.contentEditable = true
        selected_element.editing = true
        return
    }
    select_element(over_element)
    selected_element.element.contentEditable = true
    selected_element.editing = true
})

// Mouse Over
document.addEventListener('mouseover', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    if (!DEV_BODY.contains(over_element)) {unhover(); return};
    if (over_element.classList.contains('dev-hover')) {
        // guard to deselect if already selected
        unhover()
        return
    }
    unhover()
    hovered_element = over_element
    hovered_element?.classList.add('dev-hover')
})

// Mouse Up
document.addEventListener('mouseup', e => {
    let over_element = document.elementFromPoint(e.clientX, e.clientY)
    // guard against appending to selected element
    if (over_element === selected_element.element || selected_element.selected === false) return;
    // guard against moving into element inside selected element
    console.log(selected_element);
    console.log(selected_element.element.contains(over_element));
    if (selected_element.element.contains(over_element)) return;
    // guard against dragging out of dev body
    if (!DEV_BODY.contains(over_element) || DEV_BODY == over_element) return;
    // guard against dragging from the wrong node
    if (selected_element.element !== selected_element.drag_start_element) return;
    // guard against moving while editing content
    if (selected_element.editing === true) return;

    // apend to the element it was dragged to.
    let moved_element = selected_element.element.cloneNode(true)
    over_element.insertAdjacentElement("afterend", moved_element)
    selected_element.element.remove()
    selected_element.element = DEV_BODY
})