import DEV, { CSSEditorPage } from "#state/gui";

import CLIENT_STORAGE from "#state/client_storage";
import SELECTED_ELEMENT from "#state/selected_element";

import { array_remove_items } from "#utility";

import * as Types from "#types"
import Asset, { ASSET_TYPE_LIST } from "#state/classes/Asset";

// Bar

DEV.bar.element.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
        if (DEV.bar.element.getAttribute("value") === "Elements") return

        let new_node = document.createElement((e.target as HTMLInputElement).value)


        SELECTED_ELEMENT.element.appendChild(new_node)

        SELECTED_ELEMENT.select(new_node)

        CLIENT_STORAGE.history.push()

    }
})

DEV.bar.delete.addEventListener("click", e => SELECTED_ELEMENT.remove())

DEV.bar.export.addEventListener("click", async e => await CLIENT_STORAGE.export())

// Js Handler
DEV.bar.js.addEventListener("click", e => {
    DEV.script.root.style.display = "flex";
})

// css Handler
DEV.bar.css.addEventListener("click", e => {
    DEV.style.root.style.display = "flex";
})

// assets Handler
DEV.bar.assets.addEventListener("click", e => {
    DEV.assets.root.style.display = "flex";
})

// properties Handler
DEV.bar.properties.addEventListener("click", e => {
    DEV.properties.root.style.display = "block";
})

// save Handler
DEV.bar.save.addEventListener("click", e => {
    CLIENT_STORAGE.save()
})

// load Handler
DEV.bar.load.addEventListener("click", e => {
    CLIENT_STORAGE.load()
})

// Editor

// Js CLOSE Handler
DEV.script.close.addEventListener("click", e => {
    DEV.script.root.style.display = "none";
})

// css CLOSE Handler
DEV.style.close.addEventListener("click", e => {
    DEV.style.root.style.display = "none";
})

// assets CLOSE Handler
DEV.assets.close.addEventListener("click", e => {
    DEV.assets.root.style.display = "none";
})

// assets UPLOAD Handler
DEV.assets.upload.addEventListener("change", e => {
    CLIENT_STORAGE.assets.push(
        (e.target as HTMLInputElement).files[0],
        (DEV.assets.upload_name as HTMLInputElement).value
    )
})

// editor style button
DEV.style.editor.style_button.addEventListener("click", e => {
    DEV.style.switch_editor(CSSEditorPage.style)
})

// editor animation button
DEV.style.editor.animation_button.addEventListener("click", e => {
    DEV.style.switch_editor(CSSEditorPage.animation)
})

// Properties

// classes
DEV.properties.classes.addEventListener("input", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.className = `dev-selected ${(e.target as HTMLInputElement).value}`
})

// id
DEV.properties.id.addEventListener("input", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.id = (e.target as HTMLInputElement).value
})

// position
DEV.properties.position.addEventListener("change", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.style.position = (e.target as HTMLInputElement).value
})

// display
DEV.properties.display.addEventListener("change", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.style.display = (e.target as HTMLInputElement).value
})

// close
DEV.properties.close.addEventListener("click", e => {
    DEV.properties.root.style.display = "none";
})