
export const DEV_STYLE = document.getElementById('dev-style');
export const DEV_STYLE_CLOSE = document.getElementById('dev-style-close');
export const DEV_STYLE_EDITOR = document.getElementById('dev-style-editor');
export const DEV_STYLE_EXPORT = document.getElementById('dev-style-export');
export const DEV_STYLE_EDITOR_ANIMATION = document.getElementById('dev-style-editor-animation');


export const DEV_SCRIPT = document.getElementById('dev-script');
export const DEV_SCRIPT_CLOSE = document.getElementById('dev-script-close');
export const DEV_SCRIPT_EDITOR = document.getElementById('dev-script-editor');

export const DEV_BODY = document.getElementById('dev-body');

export const DEV_BAR = document.getElementById('dev-bar');
export const DEV_BAR_ELEMENT = document.getElementById('dev-bar-element');
export const DEV_BAR_BUTTON_ITALIC = document.getElementById('dev-bar-button-italic');
export const DEV_BAR_BUTTON_BOLD = document.getElementById('dev-bar-button-bold');
export const DEV_BAR_BUTTON_UNDERLINE = document.getElementById('dev-bar-button-underline');
export const DEV_BAR_BUTTON_DELETE = document.getElementById('dev-bar-button-delete');
export const DEV_BAR_BUTTON_EXPORT = document.getElementById('dev-bar-button-export');
export const DEV_BAR_BUTTON_JS = document.getElementById('dev-bar-button-js');
export const DEV_BAR_BUTTON_CSS = document.getElementById('dev-bar-button-css');
export const DEV_BAR_INPUT_TITLE = document.getElementById('dev-bar-input-title');
export const DEV_BAR_BUTTON_PROPERTIES = document.getElementById('dev-bar-button-properties')

export const DEV_PROPERTIES = document.getElementById('dev-properties');
export const DEV_PROPERTIES_CLOSE = document.getElementById('dev-properties-close');
export const DEV_PROPERTIES_CLASSES = document.getElementById('dev-properties-classes');
export const DEV_PROPERTIES_ID = document.getElementById('dev-properties-id');


export default DEV_GUI = {
    body: DEV_BODY,
    bar: {
        self: DEV_BAR,
        element: DEV_BAR_ELEMENT,
        italic: DEV_BAR_BUTTON_ITALIC,
        bold: DEV_BAR_BUTTON_BOLD,
        underline: DEV_BAR_BUTTON_UNDERLINE,
        delete: DEV_BAR_BUTTON_DELETE,
        export: DEV_BAR_BUTTON_EXPORT,
        js: DEV_BAR_BUTTON_JS,
        css: DEV_BAR_BUTTON_CSS,
        title: DEV_BAR_INPUT_TITLE,
        properties: DEV_BAR_BUTTON_PROPERTIES
    },
    properties: {
        self: DEV_PROPERTIES,
        close: DEV_PROPERTIES_CLOSE,
        classes: DEV_PROPERTIES_CLASSES,
        id: DEV_PROPERTIES_ID
    },
    script: {
        self: DEV_SCRIPT,
        close: DEV_SCRIPT_CLOSE,
        editor: DEV_SCRIPT_EDITOR
    },
    style: {
        self: DEV_STYLE,
        close: DEV_STYLE_CLOSE,
        editor: {
            style: DEV_STYLE_EDITOR,
            animation: DEV_STYLE_EDITOR_ANIMATION
        },
        export: DEV_STYLE_EXPORT
    }
}