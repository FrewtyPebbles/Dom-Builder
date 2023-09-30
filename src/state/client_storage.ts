import _DEV from "./gui_elements"

import SELECTED_ELEMENT from "./selected_element"

import * as Types from "#types"
import { dev_focused } from "#utility"
import DEV from "./gui"
import Asset, { ASSET_TYPE_LIST } from "./classes/Asset"
import * as JSZip from "jszip"
import History from "./classes/History"

/**
 * TODO : Decouple Assets from elements
 * 
 * TODO : Figure out a way to save data that isnt via local storage
 *        because it is not effective at storing images.  Consider
 *        writing a proprietary save file format that can save both
 *        html and image data together.
 * 
 * TODO : Move all the TODOs to a dedicated TODO file.
 */

const CLIENT_STORAGE: Types.ClientStorage = {
    body: _DEV.body,
    style: _DEV.style.editor.style,
    animation: _DEV.style.editor.animation,
    script: _DEV.script.editor,
    clipboard: {
        element_reference: null,
        element: null,
        copy() {
            if (!SELECTED_ELEMENT.selected) return
            if (dev_focused()) return
            let coppied_element = SELECTED_ELEMENT.element.cloneNode(true) as HTMLElement
            coppied_element.setAttribute( "class",
                coppied_element.getAttribute("class").replace(RegExp([
                    "dev-selected",
                    "dev-hover-center",
                    "dev-hover-top",
                    "dev-hover-left",
                    "dev-hover-bottom",
                    "dev-hover-right",
                    "dev-hover",
                ].join("|"), "gm"),"")
            )
            this.element = coppied_element
            this.element_reference = SELECTED_ELEMENT.element
        },
        paste() {
            if (!SELECTED_ELEMENT.selected) return
            if (dev_focused()) return
            if (ASSET_TYPE_LIST.includes(SELECTED_ELEMENT.element.tagName.toLowerCase())) return
            SELECTED_ELEMENT.unhover()
            let new_elem = this.element.cloneNode(true)

            SELECTED_ELEMENT.element.appendChild(this.element.cloneNode(true))
            CLIENT_STORAGE.history.push()
        }
    },
    history: {
        data:[new History([])],
        current_index:0,
        current(){
            return this.data[this.current_index]
        },
        push() {
            this.current_index++;

            this.data[this.current_index] = new History();

            this.data.length = this.current_index + 1;
        },
        undo() {
            if (dev_focused()) return
            if (this.current_index === 0) {return}
            this.current_index--
            this.current().apply()
        },
        redo() {
            if (dev_focused()) return
            if (this.current_index === this.data.length-1) {return}
            this.current_index++
            this.current().apply()
        }
    },
    assets: {
        data: [],
        push(file:File, name:string = "unnamed") {
            let new_asset = new Asset(name, file)
            DEV.assets.add_current(new_asset)
            this.data.push(new_asset)
            CLIENT_STORAGE.history.push()
        },
        find_from_dev_src(src:string) {
            let ret_asset = null;
            (this.data as Asset[]).every((asset) => {
                ret_asset = asset
                return asset.development_src === src;
            })
            return ret_asset
        },
        find_from_export_src(src:string) {
            let ret_asset = null;
            (this.data as Asset[]).every((asset) => {
                ret_asset = asset
                return asset.export_src === src;
            })
            return ret_asset
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
        this.history.push()
    },
    async export() {
        document.querySelectorAll("#dev-body *[contenteditable]").forEach(function(el){
            el.removeAttribute("contenteditable");
        });


        console.log(Array.from(DEV.body.querySelectorAll("img")));
        
        // Prep imgs for export
        Array.from(DEV.body.querySelectorAll("img")).forEach((img: HTMLImageElement) => {
            img.src = `assets/${CLIENT_STORAGE.assets.find_from_dev_src(img.src).file.name}`
        });

        let body = this.body.innerHTML;
        let script = this.script.state.doc.toString()
        let css = this.style.state.doc.toString().replace(/\r\n/g, "")
        let css_animation = this.animation.state.doc.toString().replace(/\r\n/g, "")

        // DOC
        let doc = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${(DEV.bar.title as HTMLInputElement).value}</title>
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

        const zip = new JSZip();

        zip.folder("assets")
        
        CLIENT_STORAGE.assets.data.forEach((asset: Asset) => {
            zip.file(`assets/${asset.file.name}`, asset.file)
        });

        zip.file(`index.html`, doc)

        let content = await zip.generateAsync({ type: 'blob' })

        const handle = await showSaveFilePicker({types:[
            {
                accept: {
                    "application/zip":[".zip"]
                }
            }
        ]});
        const writable = await handle.createWritable();
        await writable.write( content );
        writable.close();

        // unprep imgs for export
        Array.from(DEV.body.querySelectorAll("img")).forEach((img: HTMLImageElement) => {
            img.src = CLIENT_STORAGE.assets.find_from_export_src(img.src).development_src
            console.log(img);
        });
    }
}
export default CLIENT_STORAGE
