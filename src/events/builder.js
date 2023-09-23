import DEV from "../state/gui.js";

import CLIENT_STORAGE from "../state/client_storage.js";
import SELECTED_ELEMENT from "../state/selected_element.js";

import { array_remove_items, tab_to_indent } from "../utility.js";

import * as Types from "../types.js"

// Bar

DEV.bar.element.addEventListener("change", e => {
    if (e.target.value === "Elements") return

    let new_node = document.createElement(e.target.value)
    SELECTED_ELEMENT.element.appendChild(new_node)
    SELECTED_ELEMENT.select(new_node)

    CLIENT_STORAGE.history.push()

    e.target.value = "Elements"
})

DEV.bar.delete.addEventListener("click", e => SELECTED_ELEMENT.remove())

DEV.bar.export.addEventListener("click", async e => await CLIENT_STORAGE.export())

// Js Handler
DEV.bar.js.addEventListener("click", e => {
    DEV.script.root.style.display = "block";
})

// css Handler
DEV.bar.css.addEventListener("click", e => {
    DEV.style.root.style.display = "block";
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

// Properties

// classes
DEV.properties.classes.addEventListener("input", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.className = `dev-selected ${DEV.properties.classes.value}`
})

// id
DEV.properties.id.addEventListener("input", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.id = DEV.properties.id.value
})

// position
DEV.properties.position.addEventListener("change", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.style.position = DEV.properties.position.value
})

// display
DEV.properties.display.addEventListener("change", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.style.display = DEV.properties.display.value
})

// close
DEV.properties.close.addEventListener("click", e => {
    DEV.properties.root.style.display = "none";
})