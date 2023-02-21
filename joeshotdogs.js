// object for storing menu prices
let menuItems = {
    "Hot Dog" : 4,
    "Fries"   : 3.5,
    "Soda"    : 1.5,
    "Sauerkraut" : 1
};

// object for storing order quantities
let orderQuantities = {
    "Hot Dog" : 0,
    "Fries"   : 0,
    "Soda"    : 0,
    "Sauerkraut" : 0
};

// table column names
let columnNames = ["Menu Item", "Price", "Quantity"];

// formatter for displaying USD currency
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// creates and displays the menu items, prices, and quantity selectors in the menu div
function loadMenu() {

    let menu = document.getElementById("menu");
    //create a table
    let menuTable = document.createElement("table");
    menuTable.setAttribute("class", "w3-table w3-striped w3-bordered");
    menuTable.id = "menuTable";

    let index, row, cell;
    let tbody = document.createElement("tbody");

    // create header row and fill in the column names
	row = document.createElement('tr');
	for (index = 0; index < columnNames.length; index++) {
 	   cell = document.createElement('th');
 	   cell.innerText = columnNames[index];
 	   row.appendChild(cell);
	}
	tbody.appendChild(row);

    // load table with data from menuItems object
    let key, opt, selection;
    for (key in menuItems)
    {
        row = document.createElement('tr');

        cell = document.createElement('td');
        cell.innerText = key;
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.innerText = formatter.format(menuItems[key]);
        row.appendChild(cell);

        // create drop down menus so user can select quantity of items to order
        cell = document.createElement('td');
        selection = document.createElement("select");
        selection.id = key+"Quantity";

        // item quantities limited to 10
        for (let ii=0; ii <= 10; ii++){
            opt = document.createElement("option");
            opt.innerText = ii.toString();
            selection.appendChild(opt);
        }

        // update the orderQuantities each time a selector is changed
        selection.addEventListener("change",(ev) => {
            addToOrder(ev);
        } );

        cell.appendChild(selection);
        row.appendChild(cell);
    	tbody.appendChild(row);
	}
    menuTable.appendChild(tbody);
    menu.appendChild(menuTable);

    menu.appendChild(document.createElement("br"));

    // add 'Show Cart' button
    let showBtn = document.createElement("button");
    showBtn.id = "showCart";
    showBtn.innerText = "Show Cart";
    showBtn.addEventListener("click", showCart);
    menu.appendChild(showBtn);

}

// update the item quantities based on the elementId string
function addToOrder(ev) {
    let elementId = ev.target.id;
    let selection = document.getElementById(elementId);

    // selector id's are in the format "<itemName>Quantity"
    // find the position of 'Q' in the selector id string, then get the substring(0, 'Q' position)
    let pos = (selection.id).indexOf('Q');
    let key = (selection.id).substring(0, pos);

    orderQuantities[key] = selection.options[selection.selectedIndex].text;
}
function showCart() {
    // remove the printCart display area and the 'Check Out' button
    resetCart();

    // create the printCart display
    let cart = document.getElementById("cart");
    let printCart = document.createElement("div");
    printCart.setAttribute("class", "w3-container w3-border w3-center");
    printCart.id = "printCart";

    let txt = "<br/><b>Your Cart</b><br/><br/>";

    let total;
    let subtotal = 0;
    let item, itemTotal, tax;

    // print the items and quantities in the order
    for (item in orderQuantities) {
        itemTotal = menuItems[item] * orderQuantities[item];

        if (itemTotal > 0) {
            subtotal += itemTotal;
            txt += "(" + orderQuantities[item] + ") " + item + "<br/>";
        }
    }

    // if there is nothing in the cart (i.e. subtotal is zero), print message "Your Cart is Empty!" and return
    if (subtotal === 0) {
        txt = "<br/><b>Your Cart is Empty!</b><br/><br/>";
        printCart.innerHTML = txt;
        cart.appendChild(printCart);
        return;
    }

    total = subtotal;
    txt += "<br/>Subtotal = " + formatter.format(subtotal) + "<br/>";

    // if subtotal is greater than $20, add a 10% discount
    if (subtotal > 20) {
        let discount = subtotal *0.1;
        txt += "Discount = " + formatter.format(discount) + "<br/>";
        total -= discount;
    }

    // calculate and add 6.25% tax
    tax = total * .0625;
    txt += "Tax = " + formatter.format(tax) + "<br/>";
    total += tax;

    // print the total price with discount (if any) and tax
    txt += "<b>Total = " + formatter.format(total) + "</b><br/><br/>";

    printCart.innerHTML = txt;
    cart.appendChild(printCart);

    // append a "Check Out" button
    let checkout = document.getElementById("checkout");
    let checkoutBtn = document.createElement("button");
    checkoutBtn.id = "checkoutBtn";
    checkoutBtn.type = "button";
    checkoutBtn.innerText = "Check Out";
    checkoutBtn.addEventListener("click", printThankYou);

    checkout.appendChild(checkoutBtn);

}

// if "Check Out" button is clicked, print Thank You message and reset the menu
function printThankYou() {
    // remove the printCart display area and the 'Check Out' button
    resetCart();

    //create new printCart display with Thank You message
    let cart = document.getElementById("cart");
    let printCart = document.createElement("div");
    printCart.setAttribute("class", "w3-container w3-border w3-center");
    printCart.id = "printCart";

    let txt = "<br/><b>Thank you for your order!</b><br/><br/>";
    printCart.innerHTML = txt;
    cart.appendChild(printCart);

    // clear orderQuantities object
    resetMenu();
}

// remove the printCart display area and the 'Check Out' button
function resetCart() {
    let div = document.getElementById("printCart");
    if (div != null) {
        div.parentNode.removeChild(div);
    }
    div = document.getElementById("checkoutBtn");
    if (div != null) {
        div.parentNode.removeChild(div);
    }
}

// if "Check Out" button is clicked, zero out the order quantities and reset the selectors
function resetMenu() {
    let key, selection;
    for (key in menuItems) {
        orderQuantities[key] = 0;
        selection = document.getElementById(key + "Quantity");
        selection.selectedIndex = 0;
    }
}