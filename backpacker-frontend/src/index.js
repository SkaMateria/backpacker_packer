//! See how that BOOTSTRAP extension works
//! check out anime.js

const BASE_URL = "http://localhost:3000"
const BACKPACKS_URL = `${BASE_URL}/backpacks`
const ITEMS_URL = `${BASE_URL}/items`
const backpackList = document.querySelector("body > main > div")
const backpackItemList = document.querySelector("body > main > div.items")
const allItemsButton = document.querySelector("body > main > div.backpack-icon > button")
const submitItemButton = document.querySelector("body > form > input.submit")

document.addEventListener("DOMContentLoaded", () => {
    backpackData()
    allItemsButton.addEventListener("click", allItemsData)
    submitItemButton.addEventListener("click", postItem)
})

function backpackData(){
    fetch(BACKPACKS_URL)
    .then(resp => resp.json())
    .then(data => fetchBackpack(data))
}

function fetchBackpack(backpacks){
    backpacks.forEach(backpack => {
        backpackIcon(backpack)
    })
}

function backpackIcon(backpack) {
    let bpIcon = document.createElement("div")
    let btn = document.createElement("button")
    btn.setAttribute('id', backpack.id)
    btn.innerText = backpack.name
    btn.addEventListener("click", (e) => {
        backpackItemData(e), {once: true}
    })
    bpIcon.appendChild(btn)
    backpackList.appendChild(bpIcon)
}

function backpackItemData(e) {
    fetch(`${BACKPACKS_URL}/${e.target.id}`)
    .then(resp => resp.json())
    .then(backpack => fetchBackpackItems(backpack.items))
}

function fetchBackpackItems(items) {
    backpackItemList.innerHTML = ''
    items.forEach(item => {
        listBackpackItems(item)
    })
}

function listBackpackItems(item) {
    let itemIcon = document.createElement("div")
    let btn = document.createElement("button")
    btn.addEventListener("dblclick", renderEditDeleteButtons)
    btn.innerHTML = `<span>${item.name}</span>`
    itemIcon.appendChild(btn)
    backpackItemList.appendChild(itemIcon)
}

function allItemsData() {
    fetch(ITEMS_URL)
    .then(resp => resp.json())
    .then(data => fetchAllItems(data))
}

function fetchAllItems(items){
    backpackItemList.innerHTML = ''
    items.forEach(item => {
        listAllItems(item)
    })
}

function listAllItems(item) {
    let itemIcon = document.createElement("div")
    let btn = document.createElement("button")
    btn.className = item.id
    btn.dataset.selected = "false"
    btn.addEventListener("dblclick", renderEditDeleteButtons)
    btn.innerHTML = `<span>${item.name}</span>`
    itemIcon.appendChild(btn)
    backpackItemList.appendChild(itemIcon)
}

function postItem(e){
    e.preventDefault()
    let itemName = e.target.parentElement.lastElementChild
    fetch(ITEMS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ACCEPT": "application/json"
        },
        body: JSON.stringify({
            "name": itemName.value
        })
    })
    .then(resp => resp.json())
    .then(newItem => allItemsData(newItem))
    e.target.parentElement.lastElementChild.value = ""
}

function renderEditDeleteButtons(e){
    if(e.target.parentElement.dataset.selected === "true") {
        e.target.parentElement.children[1].remove()
        e.target.firstElementChild.remove()
        e.target.parentElement.dataset.selected = "false"
    }
        
    else if(e.target.parentElement.dataset.selected === "false")
    {    
    e.target.parentElement.dataset.selected = true
    let editButton = document.createElement("button")
    editButton.innerText = "Edit"
    editButton.style.backgroundColor = "orange"
    let deleteButton = document.createElement("button")
    deleteButton.innerText = "Delete"
    deleteButton.style.backgroundColor = "red"
    e.target.appendChild(editButton)
    e.target.parentElement.appendChild(deleteButton)
    deleteButton.addEventListener("click", deleteItem)
    editButton.addEventListener("click", editItem)
    }
}

function deleteItem(e) {
    let itemId = parseInt(e.target.parentElement.className)
    fetch(ITEMS_URL + "/" + itemId, {
        method: "DELETE"
    })
    .then(resp => e.target.parentElement.remove())
}

function editItem(e) {
    let itemText = e.target.parentElement.firstChild.textContent
    let el = e.target.parentElement
    let newEl = document.createElement("form")
    newEl.innerHTML = `
    <input type="text" name="name" value=${itemText} class="input-text">
    <input type="submit" name="submit" value="Update" class="submit">
    `
    newEl.value = itemText
    e.target.parentElement.parentElement.replaceChild(newEl, el);
    newEl.addEventListener("submit", patchItem)
    
}

function patchItem(e) {
    e.preventDefault()
    let itemId = parseInt(e.target.parentElement.className)
    fetch(ITEMS_URL + "/" + itemId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: e.target.name.value

        })
    })
    .then(resp => resp.json())
    .then(element => allItemsData(element))   
}

