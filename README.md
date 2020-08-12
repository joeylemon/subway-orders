# subway-orders

### What is it?

This is a Chrome extension created to make placing repeated Subway orders much easier. It stores the orders you want and allows you to automatically place them again when checking out at subway.com.

### Why?

My family oftentimes orders from Subway for lunch before they go out on the lake near their house. It became a hassle to manually place the same orders every weekend, especially because the "Favorites" function on the Subway website doesn't seem to work half of the time.

### How?

Inspecting the code behind the Subway website allowed me to find the endpoint at which orders are added to the cart. Additionally, I had to sift through the many Javascript files to find the ids and values for every ingredient you can put on a sandwich. 

The extension uses plain HTML, CSS, and Javascript for its user interface. It utilizes the Chrome API to execute code on the Subway checkout page as well as save orders on your Google account.

<br>
<img src="https://i.imgur.com/ZuNtJcn.png" width="400" />
