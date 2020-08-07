class Order {
    constructor(name, order) {
        this.name = name
        this.order = order
        this.id = Math.floor(Math.random() * 1000000)
        this.orderSteps = 0
    }

    getCategory() {
        return CATEGORIES.find(c => this.order.includes(c))
    }

    async place() {
        const tab = await getTab()
        const url = tab.url
        let code

        if (url !== "https://order.subway.com/en-US/orders/order-management") {
            code = `
            window.location = "https://order.subway.com/en-US/orders/order-management"
            `
        } else {
            code = `
            function postAjax(url, data, success) {
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

            const storeID = document.getElementById("initStoreId").value
            const cartID = document.getElementById("initCartId").value

            postAjax('/RemoteOrder/Orders/AddItemAsync', {
                "ProductId": 30102,
                "Quantity": 1,
                "CartId": cartID,
                "StoreId": storeID,
                "Options[0][Id]": 10102,
                "Options[0][Val]": "o_BreadFlat",
                "Options[1][Id]": 10109,
                "Options[1][Val]": "o_BreadToastedYes",
                "Options[2][Id]": 10112,
                "Options[2][Val]": "o_CheesePepperJack",
                "Options[3][Id]": 10132,
                "Options[3][Val]": "o_LettuceYes",
                "Options[4][Id]": 10135,
                "Options[4][Val]": "o_OnionsYes",
                "Options[5][Id]": 10158,
                "Options[5][Val]": "o_RanchYes",
                "Options[6][Id]": 10122,
                "Options[6][Val]": "o_ExtraCheeseYes"
            }, (data) => { window.location.reload() });
            `
        }

        chrome.tabs.executeScript(tab.ib, {
            code: code
        })
    }
}

const orders = [
    new Order("Joey", '6" Turkey Breast Italian Herbs & Cheese, Toasted, Provolone, Lettuce, Mayonnaise, Chipotle Southwest, Salt, Pepper, Sub Spice.'),
    new Order("Riley", '12" Oven-Roasted Chicken 9-Grain Wheat, Toasted, Provolone, Green Peppers, Banana Peppers, Less Mayonnaise, Salt, Pepper.'),
    new Order("Casey", '6" Steak & Cheese 9-Grain Wheat, Toasted, Pepper Jack, Lettuce, Green Peppers, Less Jalapeños, Banana Peppers, Chipotle Southwest.')
]