const _DEV = {
    body: document.getElementById('dev-body'),
    bar: {
        root: document.getElementById('dev-bar'),
        element: document.getElementById('dev-bar-element'),
        italic: document.getElementById('dev-bar-button-italic'),
        bold: document.getElementById('dev-bar-button-bold'),
        underline: document.getElementById('dev-bar-button-underline'),
        delete: document.getElementById('dev-bar-button-delete'),
        export: document.getElementById('dev-bar-button-export'),
        js: document.getElementById('dev-bar-button-js'),
        css: document.getElementById('dev-bar-button-css'),
        title: document.getElementById('dev-bar-input-title'),
        properties: document.getElementById('dev-bar-button-properties'),
        save: document.getElementById('dev-bar-button-save'),
        load: document.getElementById('dev-bar-button-load')
    },
    properties: {
        root: document.getElementById('dev-properties'),
        close: document.getElementById('dev-properties-close'),
        classes: document.getElementById('dev-properties-classes'),
        id: document.getElementById('dev-properties-id'),
        position: document.getElementById("dev-properties-position"),
        display: document.getElementById("dev-properties-display"),
    },
    script: {
        root: document.getElementById('dev-script'),
        close: document.getElementById('dev-script-close'),
        editor: document.getElementById('dev-script-editor')
    },
    style: {
        root: document.getElementById('dev-style'),
        close: document.getElementById('dev-style-close'),
        editor: {
            style: document.getElementById('dev-style-editor'),
            animation: document.getElementById('dev-style-editor-animation')
        },
        export: document.getElementById('dev-style-export')
    }
}

export default _DEV