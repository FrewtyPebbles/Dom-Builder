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
    DEV_BAR_BUTTON_JS
} from "./dev_bar.js";

import { selected_element } from "./events.js";

console.log("builder loaded");

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
    let css = DEV_STYLE_EDITOR.innerText
    let doc = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HTML 5 Boilerplate</title>
      </head>
      <body>
        <script>
            ${script}
        </script>
        <style>
            ${css}
        </style>
        ${body}
      </body>
    </html>`;
    download_file(doc, "index.html", "text/plain");
})

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