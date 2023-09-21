import { DEV_BODY, DEV_SCRIPT_EDITOR, DEV_STYLE_EDITOR, DEV_STYLE_EDITOR_ANIMATION } from "./elements.js"
import { change_content_editable } from "../utility.js"

import * as Types from "../types.js"
import { dev_focused } from "../utility.js"

/** @type {Types.ClientStorage} */
export var client_storage = {
    body: DEV_BODY,
    style: DEV_STYLE_EDITOR,
    animation: DEV_STYLE_EDITOR_ANIMATION,
    script: DEV_SCRIPT_EDITOR,
    clipboard: {
        element: null,
        copy() {
            if (!selected_element.selected) return
            if (dev_focused()) return
            /** @type {HTMLElement} */
            let coppied_element = selected_element.element.cloneNode(true)
            coppied_element.setAttribute( "class",
                coppied_element.getAttribute("class").replace(RegExp([
                    "dev-selected",
                    "dev-hover",
                    "dev-hover-center",
                    "dev-hover-top",
                    "dev-hover-left",
                    "dev-hover-bottom",
                    "dev-hover-right"
                ].join("|"), "gm"))
            )
            this.element = coppied_element
        },
        paste() {
            if (!selected_element.selected) return
            if (dev_focused()) return
            selected_element.unhover()
            selected_element.element.appendChild(this.element.cloneNode(true))
        }
    },
    history: {
        data:[DEV_BODY.cloneNode(true)],
        current_index:0,
        current(){
            return this.data[this.current_index].cloneNode(true)
        },
        push() {
            this.current_index++;

            let fragment = new DocumentFragment()
            let new_state = DEV_BODY.cloneNode(true)
            fragment.append(new_state)
            fragment
            .querySelectorAll(":is(.dev-selected, .dev-hover-center, .dev-hover-top, .dev-hover-left, .dev-hover-bottom, .dev-hover-right)")
            .forEach(elem => {
                elem.classList.remove("dev-selected")
                elem.classList.remove("dev-hover-center")
                elem.classList.remove("dev-hover-top")
                elem.classList.remove("dev-hover-bottom")
                elem.classList.remove("dev-hover-left")
                elem.classList.remove("dev-hover-right")
            })

            this.data[this.current_index] = fragment.childNodes[0].cloneNode(true)
            this.data.length = this.current_index + 1
        },
        undo() {
            if (this.current_index === 0) {return}
            this.current_index--
            DEV_BODY.innerHTML = ""
            DEV_BODY.append(...this.current().childNodes)
        },
        redo() {
            if (this.current_index === this.data.length-1) {return}
            this.current_index++
            DEV_BODY.innerHTML = ""
            DEV_BODY.append(...this.current().childNodes)
        }
    },
    save() {
        //Save progress
        window.localStorage.setItem("body", this.body.innerHTML)
        window.localStorage.setItem("style", this.style.value)
        window.localStorage.setItem("animation", this.animation.value)
        window.localStorage.setItem("script", this.script.value)
    },
    load() {
        let storage = window.localStorage

        let body = storage.getItem("body")
        let style = storage.getItem("style")
        let animation = storage.getItem("animation")
        let script = storage.getItem("script")

        this.body.innerHTML = body
        this.style.value = style
        this.animation.value = animation
        this.script.value = script
    }
}


/** @type {Types.SelectedElement} */
export var selected_element = {
    element: DEV_BODY,
    selected: false,
    drag_start_element: DEV_BODY,
    hovered_element: DEV_BODY,
    _select(element) {
        if (element === this.element) return false;
        this._deselect()
        this.element = element
        this.selected = true
        this.element?.classList.add('dev-selected')
        return true
    },
    select(element) {
        this._select(element)
    },
    _deselect() {
        this.element?.classList.remove('dev-selected')
        change_content_editable(this.element, false)
        this.selected = false
    },
    deselect() {
        this._deselect()
    },
    unhover() {
        [
            "center",
            "top",
            "bottom",
            "left",
            "right"
        ].forEach(pos => {
            while (this.hovered_element?.classList.contains(`dev-hover-${pos}`)) {
                this.hovered_element?.classList.remove(`dev-hover-${pos}`)
            }
        })
    }
}

selected_element.hovered_element.addEventListener("mouseleave", e => {
    selected_element.unhover()
})