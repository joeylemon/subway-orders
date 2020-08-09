chrome.runtime.sendMessage({ "message": "activate_icon" })

let selectedOrders = []

// Highlight selected orders
function updateSelectedOrders() {
    orders.forEach(order => {
        const selected = selectedOrders.find(o => o.id === order.id)
        const elem = document.getElementById(order.id)

        elem.style.backgroundColor = !selected ? "#fff" : "#009132"
        elem.style.color = !selected ? "#000" : "#fff"
    })
}

// Add the existing orders to the list
orders.forEach(order => {
    document.getElementById("orders").innerHTML += `
    <div class="order" id="${order.id}" data-id="${order.id}" data-name="${order.name}">
        <p class="title">${order.name}</p>
        <p class="body">${order.order}</p>
    </div>`
})

// Add click listener to each order
Array.from(document.querySelectorAll(".order")).forEach(elem => {
    elem.addEventListener("click", () => {
        const order = orders.find(o => o.id == elem.dataset.id)
        const adding = selectedOrders.find(o => o.id === order.id) === undefined

        if (adding)
            selectedOrders.push(order)
        else
            selectedOrders = selectedOrders.filter(o => o.id !== order.id)

        // Clear search bar
        document.getElementById("search").value = ""
        search("")

        updateSelectedOrders()
    })
})

// Search for the given name
function search(term) {
    const elems = Array.from(document.querySelectorAll(".order"))

    if (term.length === 0) {
        elems.forEach(elem => elem.style.display = "block")
        return
    }

    const filtered = elems.filter(elem => elem.dataset.name.toLowerCase().includes(term))
    elems.forEach(elem => elem.style.display = "none")
    filtered.forEach(elem => elem.style.display = "block")
}

// Search bar listener
document.getElementById("search").addEventListener("input", (e) => {
    search(e.target.value.toLowerCase())
})

// Place all of the selected orders
document.getElementById("submit").addEventListener("click", () => {
    if (selectedOrders.length === 0) return

    console.log("placing orders", selectedOrders)
    for (const order of selectedOrders) {
        execute(order.getScript())
    }

    // Show overlay
    document.getElementById("overlay").style.display = "initial"

    setTimeout(() => {
        execute("window.location.reload()")

        document.getElementById("overlay").style.display = "none"

        selectedOrders = []
        updateSelectedOrders()
    }, 2000)
})