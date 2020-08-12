let orders
let selectedOrders = []

init()

function init() {
    // Search bar listener
    document.getElementById("search").addEventListener("input", (e) => {
        search(e.target.value.toLowerCase())
    })

    // Place all of the selected orders on "Submit" click
    document.getElementById("submit").addEventListener("click", () => {
        if (selectedOrders.length === 0) return

        console.log("placing orders", selectedOrders)

        execute(preScript)
        for (const order of selectedOrders) {
            // We have to convert to Order class since chrome.storage doesn't save class types
            new Order(order.name, order.order).place()
        }

        // Show overlay
        document.getElementById("overlay").style.display = "block"

        setTimeout(() => {
            execute("window.location.reload();")
            window.close()
        }, 2000)
    })

    // Add a new order to the array
    document.getElementById("create-new-order").addEventListener("click", () => {
        const orderName = document.getElementById("new-order-name").value
        const orderDetails = document.getElementById("new-order-details").value.replace('6-inch', '6"')

        if (orderName !== "" && orderDetails !== "") {
            orders.push(new Order(orderName, orderDetails))
            chrome.storage.sync.set({ orders: orders }, initOrders)
        }

        document.getElementById("order-wrapper").style.display = "block"
        document.getElementById("new-order-wrapper").style.display = "none"

        document.getElementById("new-order-name").value = ""
        document.getElementById("new-order-details").value = ""
    })

    initOrders()
}

async function initOrders() {
    document.getElementById("orders").innerHTML = ""
    selectedOrders = []

    orders = await getSavedOrders()
    console.log("orders", orders)

    // Add the existing orders to the list
    orders.forEach(order => {
        document.getElementById("orders").innerHTML += `
        <div class="order" id="${order.id}" data-id="${order.id}" data-name="${order.name}">
            <p class="title">${order.name}</p>
            <p class="body">${order.order}</p>
            <img class="trash" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAZUlEQVRIiWNgGCmggYGB4T8a7iBGIyMWsf8UOgbFTCYKDSMbwIKBYvU09wGxFqC7kGgfDhofjFowasGoBRQAFiLVoRfr2Ip5rGDAgugplEavxXBhZD1EAT8GBoYnJFjwBKpnGAIAUcAmPA1WYN0AAAAASUVORK5CYII=" />
        </div>`
    })

    // Add "New Order" button
    document.getElementById("orders").innerHTML += `
    <input id="open-new-order" class="submit" type="button" value="Add New Order" />
    `

    // Open the new order overlay
    document.getElementById("open-new-order").addEventListener("click", () => {
        document.getElementById("order-wrapper").style.display = "none"
        document.getElementById("new-order-wrapper").style.display = "block"
    })

    // Add click listener to each order
    Array.from(document.querySelectorAll(".order")).forEach(elem => {
        elem.addEventListener("click", () => {
            const order = orders.find(o => o.id == elem.dataset.id)
            const index = selectedOrders.findIndex(o => o.id === order.id)

            if (index === -1) selectedOrders.push(order)
            else selectedOrders.splice(index, 1)

            // Clear search bar
            document.getElementById("search").value = ""
            search("")

            updateSelectedOrders()
        })

        elem.querySelector(".trash").addEventListener("click", (e) => {
            e.stopPropagation()

            orders = orders.filter(o => o.id != elem.dataset.id)
            chrome.storage.sync.set({ orders: orders }, function () {
                initOrders()
            })
        })
    })
}

// Access Chrome storage to get the saved orders
function getSavedOrders() {
    return new Promise(resolve => {
        chrome.storage.sync.get(["orders"], function (result) {
            resolve(result["orders"])
        })
    })
}

// Highlight selected orders
function updateSelectedOrders() {
    orders.forEach(order => {
        const selected = selectedOrders.find(o => o.id === order.id)
        const elem = document.getElementById(order.id)

        elem.style.backgroundColor = !selected ? "#fff" : "#009132"
        elem.style.color = !selected ? "#000" : "#fff"
    })
}

// Search for the given name
function search(term) {
    const elems = Array.from(document.querySelectorAll(".order"))

    // Show all orders if no search term is used
    if (term.length === 0) {
        elems.forEach(elem => elem.style.display = "block")
        return
    }

    const filtered = elems.filter(elem => elem.dataset.name.toLowerCase().includes(term))
    elems.forEach(elem => elem.style.display = "none")
    filtered.forEach(elem => elem.style.display = "block")
}