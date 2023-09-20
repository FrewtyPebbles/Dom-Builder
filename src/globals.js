import { DEV_BODY, DEV_SCRIPT_EDITOR, DEV_STYLE_EDITOR, DEV_STYLE_EDITOR_ANIMATION } from "./elements.js"


import * as Types from "./types.js"
import { dev_focused } from "./utility.js"

/** @type {Types.ClientStorage} */
export var client_storage = {
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

            selected_element.element.appendChild(this.element.cloneNode(true))
        }
    },
    history: [],
    body: DEV_BODY,
    style: DEV_STYLE_EDITOR,
    animation: DEV_STYLE_EDITOR_ANIMATION,
    script: DEV_SCRIPT_EDITOR,
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
export var selected_element = { element: DEV_BODY, selected: false, drag_start_element: DEV_BODY, hovered_element: DEV_BODY }