import _DEV from "./gui_elements"

import SELECTED_ELEMENT from "./selected_element"

import * as Types from "#types"
import { dev_focused } from "#utility"
import DEV from "./gui"

/** @type {Types.ClientStorage} */
const CLIENT_STORAGE: Types.ClientStorage = {
    body: _DEV.body,
    style: _DEV.style.editor.style,
    animation: _DEV.style.editor.animation,
    script: _DEV.script.editor,
    clipboard: {
        element: null,
        copy() {
            if (!SELECTED_ELEMENT.selected) return
            if (dev_focused()) return
            let coppied_element = SELECTED_ELEMENT.element.cloneNode(true) as HTMLElement
            coppied_element.setAttribute( "class",
                coppied_element.getAttribute("class").replace(RegExp([
                    "dev-selected",
                    "dev-hover",
                    "dev-hover-center",
                    "dev-hover-top",
                    "dev-hover-left",
                    "dev-hover-bottom",
                    "dev-hover-right"
                ].join("|"), "gm"),"")
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
            if (dev_focused()) return
            if (this.current_index === 0) {return}
            this.current_index--
            _DEV.body.innerHTML = ""
            _DEV.body.append(...this.current().childNodes)
        },
        redo() {
            if (dev_focused()) return
            if (this.current_index === this.data.length-1) {return}
            this.current_index++
            _DEV.body.innerHTML = ""
            _DEV.body.append(...this.current().childNodes)
        }
    },
    save() {
        //Save progress
        window.localStorage.setItem("body", this.body.innerHTML)
        window.localStorage.setItem("style", this.style.state.doc.toString())
        window.localStorage.setItem("animation", this.animation.state.doc.toString())
        window.localStorage.setItem("script", this.script.state.doc.toString())
    },
    load() {
        let storage = window.localStorage

        let body = storage.getItem("body")
        let style = storage.getItem("style")
        let animation = storage.getItem("animation")
        let script = storage.getItem("script")

        this.body.innerHTML = body
        this.style.dispatch({
            changes: {
                from: 0,
                to: this.style.state.doc.length,
                insert: style
            }
        })
        this.animation.dispatch({
            changes: {
                from: 0,
                to: this.animation.state.doc.length,
                insert: animation
            }
        })
        this.script.dispatch({
            changes: {
                from: 0,
                to: this.script.state.doc.length,
                insert: script
            }
        })
        DEV.style.render()
    },
    async export() {
        let body = this.body.innerHTML;
        let script = this.script.state.doc.toString()
        let css = this.style.state.doc.toString().replace(/\r\n/g, "")
        let css_animation = this.animation.state.doc.toString().replace(/\r\n/g, "")
        let doc = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${DEV.bar.title.getAttribute("value")}</title>
        </head>
        <body>
            ${body}
            <script>
                ${script}
            </script>
            <style>
                ${css_animation}
                ${css}
            </style>
        </body>
        </html>`;
        const handle = await showSaveFilePicker();
        const writable = await handle.createWritable();
        await writable.write( doc );
        writable.close();
    }
}
export default CLIENT_STORAGE
