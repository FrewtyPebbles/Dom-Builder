import _DEV from "./gui_elements"
// This singleton inherits its elements from _DEV so that there are not instantiation order issues with the other singletons

import SELECTED_ELEMENT from "./selected_element"

import { array_remove_items } from "#utility"
import { EditorView } from "codemirror"
import CLIENT_STORAGE from "./client_storage"
import Asset from "./classes/Asset"


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
                    this.add_dynamic_property("Image:", 
                        `
                        <div id="dev-properties-dynamic-image-root">
                        </div>
                        `,
                        (element:HTMLElement) => {
                            let root = element.querySelector("#dev-properties-dynamic-image-root");
                            for (const asset of CLIENT_STORAGE.assets.data) {
                                if (!asset.file.type.startsWith("image")) continue;
                                let new_image = document.createElement("img");
                                new_image.src = asset.development_src;
                                new_image.addEventListener("click", ev => {
                                    (SELECTED_ELEMENT.element as HTMLImageElement).src = asset.development_src
                                })
                                new_image.classList.add("dev-properties-dynamic-image-option")
                                root.appendChild(new_image);
                            }
                        }
                    )

                    this.add_dynamic_property("Alt Text:", 
                        `
                        <input class="dev-properties-dynamic-property">
                        `,
                        (element:HTMLElement) => {
                            element.querySelector("input").addEventListener("change", (ev:Event) => {
                                (SELECTED_ELEMENT.element as HTMLImageElement).alt = (ev.target as HTMLInputElement).value;
                            })
                        }
                    )
                    break;
            
                default:
                    break;
            }
        },
        /** Adds a property to the dynamic property section.  This is meant to be used one or more times per element tagname. */
        add_dynamic_property(prefix:string, HTML:string, element_callback: (element:HTMLElement) => void) {
            let input_root = document.createElement("div");
            input_root.textContent = prefix
            input_root.innerHTML += HTML
        
            // Register any events here
            element_callback(input_root);

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
    editor_focused: false,
    assets: {
        ..._DEV.assets,
        add_current(asset:Asset) {
            let root = (this.current_root as HTMLDivElement);
            //create element layout
            let asset_root = document.createElement("div");
            asset_root.innerHTML = `
                <img alt="asset display image"><span></span><button>Remove</button>
            `;
            asset_root.classList.add("dev-assets-editor-current-asset")

            //get elements in layout
            let remove_button = asset_root.querySelector("button")
            let content_span = asset_root.querySelector("span")
            let display_img = asset_root.querySelector("img")

            remove_button.addEventListener("click", (ev) => {
                CLIENT_STORAGE.assets.data = array_remove_items(CLIENT_STORAGE.assets.data, [asset])
                asset_root.remove()
                CLIENT_STORAGE.history.push()
            })

            display_img.src = asset.development_src

            content_span.innerText = asset.name
            
            root.appendChild(asset_root)
        }
    }
}

export enum CSSEditorPage {
    style,
    animation
}

export default DEV