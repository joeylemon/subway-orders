// document.getElementById("btn").addEventListener("click", () => {
//     chrome.tabs.query({ currentWindow: true, active: true },
//         (tabs) => {
//             chrome.tabs.executeScript(tabs[0].ib, {
//                 code: `alert("test")`
//             })
//         }
//     )
// })

// Add the existing orders to the list
orders.forEach(order => {
    document.getElementById("orders").innerHTML += `
    <div class="order" data-id="${order.id}" data-name="${order.name}">
        <p class="title">${order.name} #1</p>
        <p class="body">${order.order}</p>
    </div>`
})

// Search for the given name
document.getElementById("search").addEventListener("input", (e) => {
    const elems = Array.from(document.querySelectorAll(".order"))
    if (elems.length === 0) {
        elems.forEach(elem => elem.style.display = "block")
        return
    }

    const filtered = elems.filter(elem => elem.dataset.name.toLowerCase().includes(e.target.value.toLowerCase()))

    elems.forEach(elem => elem.style.display = "none")
    filtered.forEach(elem => elem.style.display = "block")
})

Array.from(document.querySelectorAll(".order")).forEach(elem => {
    elem.addEventListener("click", () => {
        const order = orders.find(o => o.id == elem.dataset.id)
        order.place()
    })
})