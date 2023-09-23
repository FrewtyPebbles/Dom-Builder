import _DEV from "./gui_elements.js"

import SELECTED_ELEMENT from "./selected_element.js"

import * as Types from "../types.js"
import { dev_focused } from "../utility.js"
import DEV from "./gui.js"

/** @type {Types.ClientStorage} */
const CLIENT_STORAGE = {
    body: _DEV.body,
    style: _DEV.style.editor.style,
    animation: _DEV.style.editor.animation,
    script: _DEV.script.editor,
    clipboard: {
        element: null,
        copy() {
            if (!SELECTED_ELEMENT.selected) return
            if (dev_focused()) return
            /** @type {HTMLElement} */
            let coppied_element = SELECTED_ELEMENT.element.cloneNode(true)
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
            if (!SELECTED_ELEMENT.selected) return
            if (dev_focused()) return
            SELECTED_ELEMENT.unhover()
            SELECTED_ELEMENT.element.appendChild(this.element.cloneNode(true))
            CLIENT_STORAGE.history.push()
        }
    },
    history: {
        data:[_DEV.body.cloneNode(true)],
        current_index:0,
        current(){
            return this.data[this.current_index].cloneNode(true)
        },
        push() {
            this.current_index++;

            let fragment = new DocumentFragment()
            let new_state = _DEV.body.cloneNode(true)
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
            _DEV.body.innerHTML = ""
            _DEV.body.append(...this.current().childNodes)
        },
        redo() {
            if (this.current_index === this.data.length-1) {return}
            this.current_index++
            _DEV.body.innerHTML = ""
            _DEV.body.append(...this.current().childNodes)
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
        DEV.style.render()
    },
    async export() {
        let body = this.body.innerHTML;
        let script = this.script.value
        let css = this.style.value.replace(/\r\n/g, "")
        let css_animation = this.animation.value.replace(/\r\n/g, "")
        let doc = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${DEV.bar.title.value}</title>
        </head>
        <body>
            <script>
                ${script}
            </script>
            <style>
                ${css_animation}
                ${css}
            </style>
            ${body}
        </body>
        </html>`;
        const handle = await showSaveFilePicker();
        const writable = await handle.createWritable();
        await writable.write( doc );
        writable.close();
    }
}
export default CLIENT_STORAGE
