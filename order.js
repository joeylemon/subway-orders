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

    getScript() {
        return `
        function post(url, data, success) {
            var params = typeof data == 'string' ? data : Object.keys(data).map(
                    function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
                ).join('&');
        
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            xhr.open('POST', url);
            xhr.onreadystatechange = function() {
                if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
            };
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(params);
            return xhr;
        }

        post('/RemoteOrder/Orders/AddItemAsync', {
            "ProductId": ${this.product_id},
            "Quantity": 1,
            "CartId": document.getElementById("initCartId").value,
            "StoreId": document.getElementById("initStoreId").value,
            ${this.getPostParameters()}
        }, (data) => { })
        `
    }
}

const orders = [
    new Order("Joey", '6" Turkey Breast, Italian Herbs & Cheese, Toasted, Provolone, Lettuce, Mayonnaise, Chipotle Southwest, Salt, Pepper, Sub Spice.'),
    new Order("Riley", '12" Oven-Roasted Chicken, 9-Grain Wheat, Toasted, Provolone, Green Peppers, Banana Peppers, Less Mayonnaise, Salt, Pepper.'),
    new Order("Casey", '6" Steak & Cheese, 9-Grain Wheat, Toasted, Pepper Jack, Lettuce, Green Peppers, Less Jalapeños, Banana Peppers, Chipotle Southwest.'),
    new Order("Clara", '12" Black Forest Ham, 9-Grain Wheat, Not Toasted, White American, Lettuce, Tomatoes, Green Peppers, Red Onions, Banana Peppers, Mayonnaise, Less Subway® Herb & Garlic Oil, Salt, Pepper'),
    new Order("Wesley", '12" Turkey Breast, 9-Grain Wheat, Not Toasted, White American, Lettuce, Tomatoes, Green Peppers, Red Onions, Banana Peppers, Mayonnaise, Less Subway® Herb & Garlic Oil, Salt, Pepper.'),
    new Order("Mom/Dad", '12" Steak & Cheese, Italian, Toasted, Pepper Jack, Deluxe $1.50, More Green Peppers, Jalapeños, Chipotle Southwest.'),
    new Order("Kaylee", '6" Turkey Breast, Italian, Double American, Lettuce')
]