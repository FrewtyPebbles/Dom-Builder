import _DEV from "./gui_elements.js"
// This singleton inherits its elements from _DEV so that there are not instantiation order issues with the other singletons

import SELECTED_ELEMENT from "./selected_element.js"

import { array_remove_items } from "../utility.js"

const DEV = {
    body: _DEV.body,
    bar: {
        ..._DEV.bar
    },
    properties: {
        ..._DEV.properties,
        /** Sets all the values in the properties tab to the properties of the currently selected element */
        set() {
            //Remove dev classes from properties editor
            this.classes.value = array_remove_items(
                [...SELECTED_ELEMENT.element.classList.values()],
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
            this.id.value = SELECTED_ELEMENT.element.id

            let styles = getComputedStyle(SELECTED_ELEMENT.element)
            this.position.value = styles.position
            this.display.value = styles.display
        }
    },
    script: {
        ..._DEV.script
    },
    style: {
        ..._DEV.style,
        render() {
            let re = /^[^\r\n&{}]+({(?=\n))|([^\n]})$/mg
            let matches = this.editor.style.state.doc.toString().matchAll(re)
            let render_value = this.editor.style.state.doc.toString().replace(/\r\n/g, "")
            let matcharray = []
            for (const _match of matches) {
                matcharray.push(_match[0])
            }
            for (const match of matcharray){
                let render_match = match
                if (match.trimStart().startsWith("body"))
                    render_match = render_match.replace("body", " ")
                render_value = render_value.replace(match, `& ${render_match}`)
            }
            this.export.innerHTML = `${this.editor.animation.state.doc.toString()}#dev-body {
                ${render_value}
            }`
        }
    },
    editor_focused: false
}

export default DEV