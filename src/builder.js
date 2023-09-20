import {
    DEV_BAR,
    DEV_BAR_ELEMENT,
    DEV_BAR_BUTTON_BOLD,
    DEV_BAR_BUTTON_DELETE,
    DEV_BAR_BUTTON_ITALIC,
    DEV_BAR_BUTTON_UNDERLINE,
    DEV_BODY,
    DEV_BAR_BUTTON_EXPORT,
    DEV_SCRIPT,
    DEV_SCRIPT_CLOSE,
    DEV_SCRIPT_EDITOR,
    DEV_STYLE,
    DEV_STYLE_CLOSE,
    DEV_STYLE_EDITOR,
    DEV_BAR_BUTTON_CSS,
    DEV_BAR_BUTTON_JS,
    DEV_STYLE_EXPORT,
    DEV_PROPERTIES,
    DEV_PROPERTIES_CLASSES,
    DEV_PROPERTIES_CLOSE,
    DEV_PROPERTIES_ID,
    DEV_STYLE_EDITOR_ANIMATION,
    DEV_BAR_INPUT_TITLE
} from "./elements.js";

import { selected_element } from "./globals.js";

import { array_remove_items } from "./utility.js";

import * as Types from "./types.js"

DEV_BAR_ELEMENT.addEventListener("click", e => {
    selected_element.element.appendChild(document.createElement(e.target.value))
})

DEV_BAR_BUTTON_DELETE.addEventListener("click", e => {
    if (selected_element.element === DEV_BODY) return;
    selected_element.element.remove()
    selected_element.element = DEV_BODY
    selected_element.selected = false
    selected_element.editing = false
})

DEV_BAR_BUTTON_EXPORT.addEventListener("click", e => {
    let body = DEV_BODY.innerHTML;
    let script = DEV_SCRIPT_EDITOR.value
    let css = DEV_STYLE_EDITOR.value.replace(/\r\n/g, "")
    let css_animation = DEV_STYLE_EDITOR_ANIMATION.value.replace(/\r\n/g, "")
    let doc = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${DEV_BAR_INPUT_TITLE.value}</title>
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
    download_file(doc, "index.html", "text/plain");
})

/** @type {(data:string, filename:string, type:string) => void} */
function download_file(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// Js Handler
DEV_BAR_BUTTON_JS.addEventListener("click", e => {
    DEV_SCRIPT.style.display = "block";
})

// css Handler
DEV_BAR_BUTTON_CSS.addEventListener("click", e => {
    DEV_STYLE.style.display = "block";
})

// Js CLOSE Handler
DEV_SCRIPT_CLOSE.addEventListener("click", e => {
    DEV_SCRIPT.style.display = "none";
})

// css CLOSE Handler
DEV_STYLE_CLOSE.addEventListener("click", e => {
    DEV_STYLE.style.display = "none";
})

/** @type {(ev: Event) => void} */
function style_input_handler(ev) {
    let re = /(^([^\r\n,&{}]+)(,(?=[^}]*{)|\s*{))/mg
    let matches = String(DEV_STYLE_EDITOR.value).matchAll(re)
    let render_value = String(DEV_STYLE_EDITOR.value.replace(/\r\n/g, ""))
    let matcharray = []
    for (const _match of matches) {
        if (!_match[0].match(/(^[ \t]*(from|to|\d+%))/))
        matcharray.push(_match[0])
    }
    for (const match of matcharray){
        let render_match = match
        if (match.trimStart().startsWith("body"))
            render_match = render_match.replace("body", " ")
        render_value = render_value.replace(match, `& ${render_match}`)
    }
    DEV_STYLE_EXPORT.innerHTML = `${DEV_STYLE_EDITOR_ANIMATION.value}#dev-body {
        ${render_value}
    }`
}

DEV_STYLE_EDITOR.addEventListener("input", style_input_handler)

DEV_STYLE_EDITOR_ANIMATION.addEventListener("input", style_input_handler)

/** @type {(ev: Event) => void} */
function tab_to_indent(ev) {
    if (ev.key == 'Tab') {
        ev.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart =
        this.selectionEnd = start + 1;
    }
}

DEV_STYLE_EDITOR.addEventListener('keydown', tab_to_indent);

DEV_STYLE_EDITOR_ANIMATION.addEventListener('keydown', tab_to_indent);

DEV_SCRIPT_EDITOR.addEventListener('keydown', tab_to_indent);

// Properties

DEV_PROPERTIES_CLASSES.addEventListener("input", e => {
    if (selected_element.element === DEV_BODY) return;
    selected_element.element.className = `dev-selected ${DEV_PROPERTIES_CLASSES.value}`
})

DEV_PROPERTIES_ID.addEventListener("input", e => {
    if (selected_element.element === DEV_BODY) return;
    selected_element.element.id = DEV_PROPERTIES_ID.value
})