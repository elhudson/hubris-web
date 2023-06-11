function accessDialog() {
    if (document.getElementById("dialog")!=null) {
        return null
    }
    else {
        let dialog=document.createElement("form")
    dialog.id="dialog"
    dialog.method="post"
    dialog.action=""
    dialog.type="text"
    let name=document.createElement("input")
    name.id="c_name"
    name.name="char_name"
    name.style="background-color: var(--base3); border:1px solid var(--base03)"
    let name_lbl=document.createElement("label")
    name_lbl.for="c_name"
    name_lbl.textContent="Enter your character's name: "
    dialog.appendChild(name_lbl)
    dialog.appendChild(name)
    document.getElementById("access").appendChild(dialog)
    }
}