class Order {
    constructor(name, order) {
        this.name = name
        this.order = order

        this.id = Math.floor(Math.random() * 1000000)
        this.footlong = this.order.includes("12\"")

        this.init()

        console.log(`${this.name}:`)
        console.log(this.getPostParameters())
    }

    init() {
        this.ingredients = []
        const parts = this.order.replace(/6" |12" |\./g, '').split(", ")

        for (const part of parts) {
            // Catch some options manually
            if (part.includes("Deluxe")) {
                this.ingredients.push({
                    id: this.footlong ? 10129 : 10029,
                    val: "o_DeluxeMeatYes"
                })
            }

            const name = part.replace(/More |Less |Double /g, "")
            const option = options.find(o => o.optionName === name || o.name === name)

            // Skip invalid options
            if (!option) continue

            // If option has no value, it's the product category (Turkey, Ham, etc)
            if (!option.value) {
                this.product_id = this.footlong ? option.id : option.id - 100
                continue
            }

            let parameter = {
                id: this.footlong ? option.id : option.id - 100,
                val: option.value
            }

            if (part.includes("Less")) {
                parameter.val = parameter.val.replace("Yes", "Light")
            } else if (part.includes("More")) {
                parameter.val = parameter.val.replace("Yes", "Extra")
            } else if (part.includes("Double") && option.type === "Cheese") {
                this.ingredients.push({
                    id: this.footlong ? 10122 : 10022,
                    val: "o_ExtraCheeseYes"
                })
            }

            this.ingredients.push(parameter)
        }
    }

    getPostParameters() {
        let options = []

        for (let i = 0; i < this.ingredients.length; i++) {
            options.push(`"Options[${i}][Id]": ${this.ingredients[i].id}`)
            options.push(`"Options[${i}][Val]": "${this.ingredients[i].val}"`)
        }

        return options.join(",\n")
    }

    place() {
        execute(`
        post('/RemoteOrder/Orders/AddItemAsync', {
            "ProductId": ${this.product_id},
            "Quantity": 1,
            "CartId": document.getElementById("initCartId").value,
            "StoreId": document.getElementById("initStoreId").value,
            ${this.getPostParameters()}
        }, (data) => { })
        `)
    }
}