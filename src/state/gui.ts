import _DEV from "./gui_elements"
// This singleton inherits its elements from _DEV so that there are not instantiation order issues with the other singletons

import SELECTED_ELEMENT from "./selected_element"

import { array_remove_items } from "#utility"
import { EditorView } from "codemirror"
import CLIENT_STORAGE from "./client_storage"


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
            this.id.value = SELECTED_ELEMENT.element.id;

            let styles = getComputedStyle(SELECTED_ELEMENT.element);
            this.position.value = styles.position;
            this.display.value = styles.display;

            //clear dynamic properties
            (this.dynamic as HTMLElement).innerHTML = "";

            
            //dynamic properties
            switch (SELECTED_ELEMENT.element.tagName) {
                case "IMG":
                    this.add_dynamic_property("Image:", { tag: "input", type: "file" }, {
                        event: "change",
                        callback: (e:Event) => {
                            window.URL.revokeObjectURL((SELECTED_ELEMENT.element as HTMLImageElement).src);
                            (SELECTED_ELEMENT.element as HTMLImageElement).src = window.URL.createObjectURL((e.target as HTMLInputElement).files[0]);
                            
                            let asset = CLIENT_STORAGE.assets.data.find((item) => item.element === SELECTED_ELEMENT.element)
                            asset.name = (e.target as HTMLInputElement).files[0].name
                            asset.development_src = (SELECTED_ELEMENT.element as HTMLImageElement).src
                            asset.file = (e.target as HTMLInputElement).files[0]
                        }
                    })
                    break;
            
                default:
                    break;
            }
        },
        add_dynamic_property(prefix:string, element:{ tag:string, type?:string }, event_callback: { event:string, callback:(event:Event)=>void }) {
            let input_root = document.createElement("div");
            input_root.textContent = prefix
            let input_element = document.createElement(element.tag);
            switch (element.tag) {
                case "input":
                    (input_element as HTMLInputElement).type = element.type;
                    break;
            
                default:
                    break;
            }
        
            //upload file
            input_element.addEventListener(event_callback.event, event_callback.callback);
        
            input_root.appendChild(input_element);
            (DEV.properties.dynamic as HTMLElement).appendChild(input_root);
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
        },
        switch_editor(editor:CSSEditorPage) {
            switch (+editor) {
                case CSSEditorPage.style:
                    (this.editor.style as EditorView).dom.parentElement.style.display = "block";
                    (this.editor.animation as EditorView).dom.parentElement.style.display = "none";
                    return;
            
                case CSSEditorPage.animation:
                    (this.editor.style as EditorView).dom.parentElement.style.display = "none";
                    (this.editor.animation as EditorView).dom.parentElement.style.display = "block";
                    return;
            }
        }
    },
    editor_focused: false
}

export enum CSSEditorPage {
    style,
    animation
}

export default DEV