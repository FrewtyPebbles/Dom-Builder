import {basicSetup} from "codemirror"
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab, defaultKeymap} from "@codemirror/commands"
import {javascript, scopeCompletionSource, javascriptLanguage} from "@codemirror/lang-javascript"
import {EditorState, StateEffect} from "@codemirror/state"
import {css} from "@codemirror/lang-css"
import DEV from "./gui"

// TODO: Fix copying of elements when in CSS editor.
// TODO: Add way to navigate parent and child elements that isnt via padding.
// TODO: Make all content not editable other than input type elements on export.

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
        editor: new EditorView({ // JS editor
            doc:"// Type your javascript here.",
            extensions: [
              basicSetup,
              keymap.of([indentWithTab, ...defaultKeymap]),
              javascript(),
              EditorView.focusChangeEffect.of((state: EditorState, focusing: boolean): StateEffect<any> => {
                DEV.editor_focused = focusing
                return null
              }),
              javascriptLanguage.data.of({autocomplete: scopeCompletionSource(globalThis)})
            ],
            parent: document.getElementById("dev-script-editor")
          })
    },
    style: {
        root: document.getElementById('dev-style'),
        close: document.getElementById('dev-style-close'),
        editor: {
            style: new EditorView({ // CSS Editor
                doc:"/* CSS Styles go here */",
                extensions: [
                  basicSetup,
                  keymap.of([indentWithTab, ...defaultKeymap]),
                  css(),
                  EditorView.focusChangeEffect.of((state: EditorState, focusing: boolean): StateEffect<any> => {
                    DEV.editor_focused = focusing
                    return null
                  }),
                  EditorView.updateListener.of((view) => {
                    if (view.docChanged) {
                        DEV.style.render()
                    }
                })
                ],
                parent: document.getElementById("dev-style-editor")
              }),
            animation: new EditorView({ // Animation Editor
                doc:"/* Keyframe Animations go here */",
                extensions: [
                  basicSetup,
                  keymap.of([indentWithTab, ...defaultKeymap]),
                  css(),
                  EditorView.focusChangeEffect.of((state: EditorState, focusing: boolean): StateEffect<any> => {
                    DEV.editor_focused = focusing
                    return null
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