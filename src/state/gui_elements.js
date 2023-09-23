import {basicSetup} from "codemirror"
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {javascript} from "@codemirror/lang-javascript"
import {css} from "@codemirror/lang-css"
import DEV from "./gui"


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
        editor: new EditorView({
            doc:"// Type your javascript here.",
            extensions: [
              basicSetup,
              keymap.of([indentWithTab]),
              javascript(),
              EditorView.focusChangeEffect.of((state, focusing) => {
                DEV.editor_focused = focusing
              })
            ],
            parent: document.getElementById("dev-script-editor")
          })
    },
    style: {
        root: document.getElementById('dev-style'),
        close: document.getElementById('dev-style-close'),
        editor: {
            style: new EditorView({
                doc:"/* CSS Styles go here */",
                extensions: [
                  basicSetup,
                  keymap.of([indentWithTab]),
                  css(),
                  EditorView.focusChangeEffect.of((state, focusing) => {
                    DEV.editor_focused = focusing
                  }),
                  EditorView.updateListener.of((view) => {
                    if (view.docChanged) {
                        DEV.style.render()
                    }
                })
                ],
                parent: document.getElementById("dev-style-editor")
              }),
            animation: new EditorView({
                doc:"/* Keyframe Animations go here */",
                extensions: [
                  basicSetup,
                  keymap.of([indentWithTab]),
                  css(),
                  EditorView.focusChangeEffect.of((state, focusing) => {
                    DEV.editor_focused = focusing
                  }),
                  EditorView.updateListener.of((view) => {
                    if (view.docChanged) {
                        DEV.style.render()
                    }
                })
                ],
                parent: document.getElementById("dev-style-editor-animation")
              })
        },
        export: document.getElementById('dev-style-export')
    }
}

export default _DEV