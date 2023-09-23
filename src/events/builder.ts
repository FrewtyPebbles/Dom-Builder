import DEV from "#state/gui";

import CLIENT_STORAGE from "#state/client_storage";
import SELECTED_ELEMENT from "#state/selected_element";

import { array_remove_items } from "#utility";

import * as Types from "#types"

// Bar

DEV.bar.element.addEventListener("change", e => {
    if (DEV.bar.element.getAttribute("value") === "Elements") return

    let new_node = document.createElement(DEV.bar.element.getAttribute("value"))
    SELECTED_ELEMENT.element.appendChild(new_node)
    SELECTED_ELEMENT.select(new_node)

    CLIENT_STORAGE.history.push()

    DEV.bar.element.setAttribute("value", "Elements")
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
    SELECTED_ELEMENT.element.className = `dev-selected ${DEV.properties.classes.getAttribute("value")}`
})

// id
DEV.properties.id.addEventListener("input", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.id = DEV.properties.id.getAttribute("value")
})

// position
DEV.properties.position.addEventListener("change", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.style.position = DEV.properties.position.getAttribute("value")
})

// display
DEV.properties.display.addEventListener("change", e => {
    if (SELECTED_ELEMENT.element === DEV.body) return;
    SELECTED_ELEMENT.element.style.display = DEV.properties.display.getAttribute("value")
})

// close
DEV.properties.close.addEventListener("click", e => {
    DEV.properties.root.style.display = "none";
})