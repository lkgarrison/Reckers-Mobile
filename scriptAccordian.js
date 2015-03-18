/**
 * Created by User Name on 12/3/2014.
 */
var qq = function (id) {
    return document.getElementById(id);
};

menu = []; // this will be an array of the food objects. makes menu a global variable
ordered = []; // array keeps track of menu index of ordered items
total = 0;
totalQuantity = 0;

// create a table for each of the food types
pizzaTable = document.createElement("table");
piadinaTable = document.createElement("table");
americanFareTable = document.createElement("table");
saladTable = document.createElement("table");
breakfastTable = document.createElement("table");
sideTable = document.createElement("table");
smoothieTable = document.createElement("table");

var loadMenu = function() {

    Parse.initialize("CZtjkZAV9gQzln2C3KKi7vsXRl4ppAMenjXiPGrx", "LVzkRhUfya9rMXDxGlda88o9d8XkPvd19YJdgWC6");

    var counter = 0; // used to check if on last object

    var query = new Parse.Query("Menu");

    query.find({
        success: function (results) {
            // Store all data stored on Parse
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                menu.push({
                    item: object.get("item"), type: object.get("type"),
                    price: object.get("price"), qty: 0, description: object.get("description")
                });
                if (++counter == results.length) displayMenu();     // this forces displayMenu to wait on the query to load
            }
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}

var displayMenu = function() {
    for(var i = 0; i < menu.length; i++) {
        var tr = document.createElement("tr");  // first row will contain add button, item name, price

        // add the add buttons
        var item = document.createElement("td");
        var button = document.createElement("td");
        var addButton = document.createElement("input");
        addButton.setAttribute("id", parseInt(i));       // assign a unique id to the button that is the item name. this id it the menu index of the item
        addButton.setAttribute("onClick", "customizeItem(this.id)"); // set onClick property to call the add function, passing the id of the item
        addButton.setAttribute("type", "button");
        addButton.setAttribute("class", "addButton");
        addButton.setAttribute("value", "");
        addButton.setAttribute("data-role", "none");
        button.appendChild(addButton);
        tr.appendChild(button);

        // add item names
        item.textContent = menu[i].item;
        item.setAttribute("class", "menuItem");
        tr.appendChild(item);

        // add price
        var price = document.createElement("td");
        price.textContent = "$" + menu[i].price.toFixed(2);
        price.setAttribute("class", "price");
        tr.appendChild(price);

        chooseSection(tr, i);

        var tr = document.createElement("tr"); // second row is for description only
        tr.appendChild(document.createElement("td")); // add an empty cell for spacing
        var description = document.createElement("td");
        description.textContent = menu[i].description;
        description.setAttribute("class", "description");
        tr.appendChild(description);

        chooseSection(tr, i);
    }

    qq("pizzas").appendChild(pizzaTable);
    qq("piadinas").appendChild(piadinaTable);
    qq("americanFare").appendChild(americanFareTable);
    qq("salads").appendChild(saladTable);
    qq("breakfast").appendChild(breakfastTable);
    qq("sides").appendChild(sideTable);
    qq("smoothies").appendChild(smoothieTable);
};

// adds row to correct section in the accordion
var chooseSection = function(tr, i) {

    if(menu[i].type == "pizza") {
        pizzaTable.appendChild(tr);
    } else if(menu[i].type == "piadina") {
        piadinaTable.appendChild(tr);
    } else if(menu[i].type == "americanFare") {
        americanFareTable.appendChild(tr);
    } else if(menu[i].type == "salad") {
        saladTable.appendChild(tr);
    } else if(menu[i].type == "breakfast") {
        breakfastTable.appendChild(tr);
    } else if(menu[i].type == "side") {
        sideTable.appendChild(tr);
    } else if(menu[i].type == "smoothie") {
        smoothieTable.appendChild(tr);
    } else {
        console.log("item type mismatch");
    }
};

// opens a popup to customize the item that was clicked
var customizeItem = function(clicked_id) {
    qq("addButton").setAttribute("onclick", "add(" + clicked_id + ")");   // set pop-up's "Add" button to send clicked_id to add function
    $("#customizeItem").width($(window).width());
    qq("customizeItemName").textContent = menu[clicked_id].item;
    qq("customizeItemPrice").textContent = "$ " + menu[clicked_id].price.toFixed(2);
    $("#ingredientsList").css("min-width", .4 * $(window).width());     // set min-width of checkboxes

    // store an array with all ingredients
    var ingredientsList = menu[clicked_id].description.split(",");

    qq("ingredientsList").innerHTML = "";
    var newSet = '<fieldset data-role="controlgroup" class="cbGroup' + '"></fieldset>';
    $('.ingredientsList').append(newSet);

    for(i = 0; i < ingredientsList.length; i++) {
        var newBox = '<input type="checkbox" name="ingredientCB-' + i + '" id="ingredientCB-' + i
            + '" class="custom" /> <label for="ingredientCB-'+ i + '">' + capitalizeFirstLetter(ingredientsList[i]) + '</label>';
        $(".cbGroup").append(newBox).trigger('create');
        $('#ingredientCB-' + i).prop('checked', true).checkboxradio('refresh');
    }

    $("#customizeItem").popup("open");

   // add(clicked_id);    // adds item to order page in table
}

// this function takes in the id (menu index) of the item that was specified to be added
var add = function(clicked_id) {
    console.log(clicked_id);
    clicked_id = parseInt(clicked_id);
    if(qq("noOrders") != null) qq("noOrders").remove();
    menu[clicked_id].qty++; // adds 1 to the quantity of this item
    total += menu[clicked_id].price;

    // immediately set "+" icon to another color. change back after a few milliseconds
    qq(parseInt(clicked_id)).setAttribute("style","background-image:url('img/addButtonPressed.png')")
    setTimeout(function(){qq(parseInt(clicked_id)).setAttribute("style","background-image:url('img/addButton.png')")},500)

    if(totalQuantity == 0) {   // just added first item
        qq("items_in_cart").style.paddingRight = "8px";
        qq("items_in_cart").style.visibility="visible";  // show counter label
        qq("cart_logo").src="img/cartWithItems.png"; // use this cart image so that the qty can be overlayed
    } else if(totalQuantity >= 9) { // needs to be shifted for double digits
        qq("items_in_cart").style.paddingRight = "3px";
    }

    // if 1st time item is being added to cart
    if(menu[clicked_id].qty == 1) {
        var tr = document.createElement("tr"); // create a new row
        tr.setAttribute("id", "row" + parseInt(clicked_id));

        // create div for remove button
        var wrapper = document.createElement("div");
        wrapper.setAttribute("class", "rmButtonWrapper");

        // every time an item is added, give it a remove button
        var button = document.createElement("td");
        var removeButton = document.createElement("input");
        removeButton.setAttribute("id", "rm" + parseInt(clicked_id));       // assign a unique id to the button that is the item name. this id it the menu index of the item
        removeButton.setAttribute("onClick", "remove1(this.id)"); // set onClick property to call the remove function, passing the id of the item
        removeButton.setAttribute("type", "button");
        removeButton.setAttribute("class", "removeButton");
        removeButton.setAttribute("value", "");
        removeButton.setAttribute("data-role", "none");
        button.appendChild(removeButton);
        wrapper.appendChild(button);
        tr.appendChild(wrapper);

        // add quantity to order space
        var qty = document.createElement("td");
        qty.textContent = parseInt(menu[clicked_id].qty);
        qty.setAttribute("id", "qty" + parseInt(clicked_id));        // give a unique id to each quantity so that it can be updated later
        qty.setAttribute("class", "quantity");
        tr.appendChild(qty);

        // add item name next to quantity
        var item = document.createElement("td");
        item.textContent = menu[clicked_id].item;
        item.setAttribute("class", "itemName");
        tr.appendChild(item);

        // add price
        var price = document.createElement("td");
        price.textContent = " $" + menu[clicked_id].price.toFixed(2);
        price.setAttribute("class", "price");
        tr.appendChild(price);

        qq("orderTable").appendChild(tr);
        ordered.push(clicked_id);   // adds this item's menu index to the ordered array, to make sure it can't be added again (only adjust quantity)

    } else {   // menu item has already been added. just adjust the quantity
        qq("qty" + parseInt(clicked_id)).textContent = parseInt(menu[clicked_id].qty);
    }

    qq("items_in_cart").textContent = ++totalQuantity;
    qq("total").innerHTML = "Total: $" + parseFloat(Math.abs(total)).toFixed(2);  // update total

};

var remove1 = function(id) {
    var copy = id;
    id = id.substring(2, id.length);   // get number from id
    id = parseInt(id);
    menu[id].qty--;
    total -= menu[id].price;  // update total

    // if there are no items in the cart now, change cart icon and go back to main page
    totalQuantity--;
    if(totalQuantity == 0) {
        document.getElementById("items_in_cart").style.visibility="hidden";  // hide label
        qq("cart_logo").src="img/cartEmpty.png"; // change back to the regular cart image
        goToMenu(); // go back to menu page automatically
    } else if(totalQuantity < 10) {     // if qty is not in double digits
        qq("items_in_cart").style.paddingRight = "8px";
    }

    // if there is still at least 1 of these items in the cart
    if(menu[id].qty > 0) {
        qq("qty" + parseInt(id)).textContent = parseInt(menu[id].qty);   // redisplay qty
    } else { // qty == 0
        qq("row" + parseInt(id)).remove();
        ordered.splice(ordered.indexOf(id), 1);     // remove this item from the ordered array list, since 0 are ordered now
    }
    qq("total").innerHTML = "Total: $" + parseFloat(Math.abs(total)).toFixed(2);    // redisplay total
    qq("items_in_cart").textContent = totalQuantity;
};

// open pop-up to confirm payment and order
var submitClicked = function() {
    if(totalQuantity > 0) {
        qq("submitMessage").textContent = "Would you like to confirm your order of $" + total.toFixed(2) + "?"; // set confirmation message
        //$("#submitClicked").popup("open");
        document.activeElement.blur();
        setTimeout(function(){$("#submitClicked").popup("open")}, 500);
    } else {
        confirm("You have not ordered any items."); // should never occur with automatic transition to menu page when removing last item in cart
    }
}

// open pop-up to enter payment method information upon method selection
var paymentMethodSelected = function(paymentMethod) {
    $("#enterPaymentDetails").show();               // display payment method details form upon radio selection
    qq("paymentMethodPopupContent").innerHTML = ""; // clears the span so that the content can be appended

    div = document.createElement("div");
    div.setAttribute("class", "ui-field-contain");

    if(paymentMethod === "creditCard") {
        $("#creditCardExpDate").show();

        cardholderName = document.createElement("input");
        cardholderName.setAttribute("type", "text");
        cardholderName.setAttribute("name", "cardholderName");
        cardholderName.setAttribute("id", "cardHolderName");
        cardholderName.setAttribute("placeholder", "Cardholder Name");
        cardholderName.setAttribute("value", "");
        div.appendChild(cardholderName);

        creditCardNumber = document.createElement("input");
        creditCardNumber.setAttribute("type", "text");
        creditCardNumber.setAttribute("name", "creditCardNumber");
        creditCardNumber.setAttribute("id", "creditCardNumber");
        creditCardNumber.setAttribute("placeholder", "Credit Card Number");
        creditCardNumber.setAttribute("value", "");
        div.appendChild(creditCardNumber);
        }

    else if(paymentMethod === "flexPoints" || paymentMethod === "domerDollars") {
        $("#creditCardExpDate").hide();

        netID = document.createElement("input");
        netID.setAttribute("type", "text");
        netID.setAttribute("name", "netID");
        netID.setAttribute("id", "netID");
        netID.setAttribute("placeholder", "netID");
        netID.setAttribute("value", "");
        div.appendChild(netID);
    }

    qq("paymentMethodPopupContent").appendChild(div);       // add form contents to popup
   // $("#paymentMethodInfo").popup("open");                  // display the pop-up
}

// detect radio button selection change
$(document).on('change', '[type="radio"]', function(){
    paymentMethodSelected($(this).attr('id'));  // pass id of selected radio button
});

// function to clear all items from cart and go back to the menu page with the menu collapsed
var cancelOrder = function() {
    $.mobile.changePage("#menu");
    orderedCopy = ordered.slice();      // copy of ordered, since ordered is going to be changed by remove1 function

    for(i = 0; i < orderedCopy.length; i++) {   // for every index in the array: ordered
        itemQty = menu[orderedCopy[i]].qty; // save this value, because it will change as each item is removed
        for(qty = 0; qty < itemQty; qty++) {   // for given qty of this item added to cart
            remove1("rm" + orderedCopy[i]); // remove all items in cart (deletes rows, updates totalQuantity and total cost, ect
        }
    }
    $( "#accordion" ).children().collapsible( "collapse" );     // collapse the collapsible set
}

// function to see if there are any items in the cart or not and decide whether or not to change pages or display a msg
var checkQuantity = function() {     // will determine whether to go to checkout page or not based on # items in cart
    if(totalQuantity == 0) {
        $("#emptyCartMessage").popup("open");
    } else {
        $.mobile.changePage("#order");
    }
}

// function to change to menu page and collapse the accordion
var goToMenu = function() {          // button click will change to menu page
    $( "#accordion" ).children().collapsible( "collapse" );     // collapse the collapsible set
    $.mobile.changePage("#menu");
}

// function to change to the pickup screen
var goToPickup = function() {
    displayDate();
    $.mobile.changePage("#pickup");
}

// display date & time on pick-up page
var displayDate = function () {
    var currentDate = new Date();

    // get date
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var day = days[currentDate.getDay()];       // each day is found at the index of its day number -1
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months[currentDate.getMonth()];     // each month in array is found at the index of its month number - 1
    var year = currentDate.getFullYear();

    // get time
    var timeClassification = "AM";             // default, A.M. vs P.M.
    var hour = currentDate.getHours();
    if(hour > 12) {
        hour -= 12;
        timeClassification = "PM";
    }
    var minutes = currentDate.getMinutes();
    if(minutes < 10) minutes = "0" + minutes;

    qq("pickupTime").textContent = hour + ":" + minutes + " " + timeClassification;
    qq("pickupDate").textContent = day + ", " + month + " " + currentDate.getDate();
}

// used to display ingredients list in item customizer pop-up
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

window.onload = function () {
    loadMenu();
    $("#enterPaymentDetails").hide();   // keep payment method details form hidden until a method is selected
};

