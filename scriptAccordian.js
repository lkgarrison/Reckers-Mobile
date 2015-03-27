/**
 * Created by User Name on 12/3/2014.
 */
var qq = function (id) {
    return document.getElementById(id);
};

menu = []; // this will be an array of the food objects. makes menu a global variable
ordered = []; // array keeps track of menu index of ordered items
total = 0;  // track total cost of items in cart
totalQuantity = 0;  // total number of items in cart (displayed in cart image)
cart = [];          // array to hold all objects that are in cart (item, qty, price, ingredients, options
cartCounter = 0;    // count every time an item is added to the cart. Only counts up

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
                    price: object.get("price"), qty: 0, description: object.get("description"),
                    ingredients: object.get("ingredients"),
                    prices: object.get("prices")
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
        item.setAttribute("id", i + "item");
        item.setAttribute("onClick", "customizeItem(" + parseInt(item.id) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
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
    switch (menu[i].type) {
        case "pizza":
            pizzaTable.appendChild(tr);
            break;
        case "piadina":
            piadinaTable.appendChild(tr);
            break;
        case "americanFare":
            americanFareTable.appendChild(tr);
            break;
        case "salad":
            saladTable.appendChild(tr);
            break;
        case "breakfast":
            breakfastTable.appendChild(tr);
            break;
        case "side":
            sideTable.appendChild(tr);
            break;
        case "smoothie":
            smoothieTable.appendChild(tr);
            break;
        default:
            console.log("Item type mismatch");
            break;
    }
};

// opens a popup to customize the item that was clicked
var customizeItem = function(clicked_id) {
    qq("addButton").setAttribute("onclick", "add(" + clicked_id + ")");   // set pop-up's "Add" button to send clicked_id to add function
    $("#customizeItem").width($(window).width());
    qq("customizeItemName").textContent = menu[clicked_id].item;
    qq("customizeItemPrice").textContent = "$" + menu[clicked_id].price.toFixed(2);
    $("#includedIngredientsLabel").css("display", "inherit");   // display label by default
    $("#customizeItemOptionsHeader").css("display", "none");    // don't display "Options" label by default
    $("#ingredientsList").css("min-width", .4 * $(window).width());     // set min-width of checkboxes
    qq("ingredientsPopupMessage").textContent = "";     // make sure no message is being displayed
    qq("ingredientsList").innerHTML = "";               // remove previous item's checkboxes, start over fresh
    qq("itemOptions").innerHTML = "";         // remove previous item's possible radio group
    $("#itemOptions").css("display", "none");   // default, unless there are options

    // store an array with all ingredients
    var noContentFlag = true;   // assume no content
    // generate checkboxes of ingredients list
    if(menu[clicked_id].ingredients != null) {
        noContentFlag = false;
        ingredientsList = menu[clicked_id].ingredients.split(",");

        var newSet = '<fieldset data-role="controlgroup" class="cbGroup' + '"></fieldset>';
        $('.ingredientsList').append(newSet);

        for(i = 0; i < ingredientsList.length; i++) {
            // label element must have a class and ID in order to grab all checkbox labels later and get their text content
            var newBox = '<input type="checkbox" name="ingredientCB" id="ingredientCB-' + i
                + '" class="custom" /> <label for="ingredientCB-'+ i + '" class="ingredientCBlabel" id="ingredientCBlabel-' + i + '">'
                + ingredientsList[i] + '</label>';
            $(".cbGroup").append(newBox).trigger('create');
            $('#ingredientCB-' + i).prop('checked', true).checkboxradio('refresh');
        }
    }
    // generate radio buttons to select options
    if(menu[clicked_id].prices != null) {
        noContentFlag = false;
        $("#itemOptions").css("display", "inherit");
        $("#customizeItemOptionsHeader").css("display", "inherit");
        var itemOptions = menu[clicked_id].prices;
        var radioGroup = '<fieldset data-role="controlgroup" id="itemOptionsRadioGroup"></fieldset>';
        $("#itemOptions").append(radioGroup);
        for(option in itemOptions) {
            if (itemOptions.hasOwnProperty(option)) {
                var radioOption = '<input type="radio" name="radio-itemOption" id="radioItemOption-' + option + '" value="off">' +
                    '<label for="radioItemOption-' + option + '" class="itemOptionRadios" id="itemOptionRadios-' + option + '">'
                    + option + ": $" + itemOptions[option] + '</label>';
                $("#itemOptionsRadioGroup").append(radioOption).trigger('create');
                var newPrice = itemOptions[option];
                qq("radioItemOption-" + option).setAttribute("onclick", "setPopupPrice(" + newPrice + ")"); // set property to adjust price displayed at the top of the popup upon radio selection
            }
        }
        $("#includedIngredientsLabel").css("display", "none");      // hide "ingredients" label
    }


    // set image for divider line at the top of popup based on food type
    var imgPath;    // string to store the image path
    switch(menu[clicked_id].type) {
        case "pizza":
            imgPath = "img/header_pizza.png"; break;
        case "piadina":
            imgPath = "img/header_piadina.png"; break;
        case "americanFare":
            imgPath = "img/header_sandwiches.png"; break;
        case "salad":
            imgPath = "img/header_salads.png"; break;
        case "breakfast":
            imgPath = "img/header_breakfast.png"; break;
        case "side":
            imgPath = "img/header_sides.png"; break;
        default:
            imgPath = "img/header_reckers.png";
    }
    $("#customizeItemColoredLine").css("background-image", "url('" + imgPath + "')");

    // allow accordian to scroll again after popup closes (in case popup needed scrolling)
    $( "#customizeItem" ).on( "popupafterclose", function( event, ui ) {
        $("body.ui-mobile-viewport").css("overflow", "auto");
    } );

    // manually set height on popup so that scrolling will work within the popup
    $("#customizeItem").css("visibility", "hidden");
    $("#customizeItem").css("height", "");          // reset to default
    $("#ingredientsList").css("height", "");          // reset to default
    $("#customizeItem").css("padding-bottom", ""); // reset (needs to be increased for scroll-div
    $("body.ui-mobile-viewport").css("overflow", "hidden"); // prevent accordian from scrolling while popup is open (in case popup needs to scroll)
    $("#customizeItem").popup("open");                  // open but do not show. open in order to extract properties
    var newHeight =  $("#customizeItem").height();
    $("#customizeItem").css("height", newHeight);           // set height to itself - allows popup to be positioned correctly and scroll
    $("#customizeItem").css("max-height", .7 * $(window).height());

    // must manually set height of scroll-div for scrolling to work. If ingredients div is too large for popup space, then set the checkboxes' div to its max allowed height to enable scrolling
    var divHeight = $("#customizeItem").outerHeight() - $("#ingredientsList").position().top - $("#popupButtonWrapper").outerHeight();
    if($("#ingredientsList").height() > divHeight) {    // if height of container of ingredients > max height of area to display, add scrolling
        $("#ingredientsList").css("height", divHeight); // specifically set height to enable scrolling
        $("#customizeItem").css("padding-bottom", parseFloat($("#customizeItem").css("padding-bottom")) * 2 + "px");    // must be multplied by 2 to have same padding as non-scroll popup
    } else {
        $("#ingredientsList").css("height", $("#ingredientsList").height());
    }
    $("#customizeItem").css("visibility", "visible");
}

// function to change the price displayed in the add item /  ingredients popup
var setPopupPrice = function(newPrice) {
    newPrice = "$" + newPrice;
    qq("customizeItemPrice").textContent = newPrice;
}

// this function takes in the id (menu index) of the item that was specified to be added
var add = function(clicked_id) {
    clicked_id = parseInt(clicked_id);
    if(qq("noOrders") != null) qq("noOrders").remove();
    menu[clicked_id].qty++; // adds 1 to the quantity of this item

    // set formatting for cart logo with item count
    if(totalQuantity == 0) {   // just added first item
        qq("items_in_cart").style.paddingRight = "8px";
        qq("items_in_cart").style.visibility="visible";  // show counter label
        qq("cart_logo").src="img/cartWithItems.png"; // use this cart image so that the qty can be overlayed
    } else if(totalQuantity >= 9) { // needs to be shifted for double digits
        qq("items_in_cart").style.paddingRight = "3px";
    }

    /* will return cartCounter if it is the first unique item will all selected ingredients, otherwise retrurns
     * the cart index of the item that is exactly the same
     */

    // capture all useful item information and store in new cart index. discard later if item is not unique (already in cart)
        cart.push({});              // push a blank object onto the array
        cart[cartCounter]["item"] = menu[clicked_id].item;
        cart[cartCounter]["price"] = menu[clicked_id].price;
        cart[cartCounter]["qty"] = 1;
        cart[cartCounter]["ingredients"] = [];    // store an array of all ingredients
        cart[cartCounter]["options"] = null;
        // add all selected ingredients from pop-up
        if(menu[clicked_id].ingredients != null) {
            // collect all checkboxes and labels
            var ingredientCheckboxLabels = document.getElementsByClassName("ingredientCBlabel");
            var ingredientCheckboxes = document.getElementsByName("ingredientCB");
            // for each CB that is checked, add that label's text content (the ingredient) to the cart object
            for(var i = 0; i < ingredientCheckboxes.length; i++) {
                var checkboxID = ingredientCheckboxes[i].id;
                if ($("#" + checkboxID).is(':checked')) {
                    cart[cartCounter]["ingredients"].push(qq(ingredientCheckboxLabels[i].id).textContent);
                }
            }
        }

        // save options
        if(menu[clicked_id].prices != null) {
           // cart[cartCounter].price =
            var optionsLabels = document.getElementsByClassName("itemOptionRadios");
            var optionRadios = document.getElementsByName("radio-itemOption");

            // Find the option that is selected. Update price if an option is selected
            for(var i = 0; i < optionRadios.length; i++) {
                var radioID = optionRadios[i].id;
                if($("#" + radioID).is(':checked')) {
                    var optionLabel = qq(optionsLabels[i].id).textContent;
                    var option = optionLabel.match(/^[^:]*/g);
                    cart[cartCounter]["option"] = option[0];                        // update selected option (ie "Regular")
                    cart[cartCounter].price = menu[clicked_id].prices[option[0]];   // update item's price in cart based on option
                    break;
                }
            }
        }
    total+= cart[cartCounter].price;        // update the total price of the current cart.
    var cartIndex = getCartIndex(cartCounter);
    //var cartIndex = cartCounter;


    if(cartIndex != cartCounter) {      // the exact item is already in the cart once. just update the quantity
        cart[cartIndex].qty++;
        cart.pop();                     // remove the most recently added item, since it's info is already capture
    } else {                            // the item is new/unique
        cartCounter++;
    }



    // if 1st time item is being added to cart
//    if(menu[clicked_id].qty == 1) {
    if(cart[cartIndex].qty == 1) {
        var tr = document.createElement("tr"); // create a new row
        tr.setAttribute("class", "row" + parseInt(cartIndex));

        // create div for remove button
        var wrapper = document.createElement("div");
        wrapper.setAttribute("class", "rmButtonWrapper");

        // every time an item is added, give it a remove button
        var button = document.createElement("td");
       // var removeButton = document.createElement("input");
        button.setAttribute("id", "rm" + parseInt(cartIndex));       // assign a unique id to the button that is the item name. this id it the menu index of the item
        button.setAttribute("onClick", "remove1(this.id)"); // set onClick property to call the remove function, passing the id of the item
        button.setAttribute("type", "button");
        button.setAttribute("class", "removeButton");
        button.setAttribute("value", "");
        button.setAttribute("data-role", "none");
   //     button.appendChild(removeButton);
        wrapper.appendChild(button);
        tr.appendChild(button);

        // add quantity to order space
        var qty = document.createElement("td");
        qty.textContent = parseInt(cart[cartIndex].qty);
        qty.setAttribute("id", "qty" + parseInt(cartIndex));        // give a unique id to each quantity so that it can be updated later
        qty.setAttribute("class", "quantity checkoutPage");
        tr.appendChild(qty);

        // add item name next to quantity
        var item = document.createElement("td");
        item.textContent = cart[cartIndex].item;
        item.setAttribute("class", "itemName checkoutPage");
        tr.appendChild(item);

        // add price
        var price = document.createElement("td");
        price.textContent = " $" + cart[cartIndex].price.toFixed(2);
        price.setAttribute("class", "price checkoutPage");
        tr.appendChild(price);

        qq("orderTable").appendChild(tr);

        // add a paragraph listing of selected ingredients below the line item
        var tr = document.createElement("tr");
        tr.setAttribute("class", "row" + parseInt(cartIndex));
        tr.appendChild(document.createElement("td"));   // must skip over 2 cells to place ingredients listing
        tr.appendChild(document.createElement("td"));
        // add each ingredient selected to the checkout page below the line item
        var ingredientsCell = document.createElement("td");
        var ingredientsList = "";
        if(cart[cartIndex].option != null) {
            ingredientsList += cart[cartIndex].option;
        }
        if(cart[cartIndex].ingredients.length > 0 && cart[cartIndex].option != null) ingredientsList+= ": "; // if there are options and ingredients, display: option: ingredients listing
        for(var i = 0; i < cart[cartIndex].ingredients.length; i++) {
            ingredientsList+= cart[cartIndex].ingredients[i];
            if(i != cart[cartIndex].ingredients.length - 1) ingredientsList += ", ";
        }
        ingredientsCell.textContent = ingredientsList;
        ingredientsCell.setAttribute("class", "description");   // the same as the description in the accordian on the order page
        tr.appendChild(ingredientsCell);

        qq("orderTable").appendChild(tr);

        ordered.push(cartIndex);   // adds this item's menu index to the ordered array, to make sure it can't be added again (only adjust quantity)

    } else {   // menu item has already been added. just adjust the quantity
        qq("qty" + parseInt(cartIndex)).textContent = parseInt(cart[cartIndex].qty);
    }

    qq("items_in_cart").textContent = ++totalQuantity;
    qq("total").innerHTML = "Total: $" + parseFloat(Math.abs(total)).toFixed(2);  // update total
};

// trigger when remove button is clicked on checkout page to remove one instance of an item
// argument will be the cartIndex
var remove1 = function(cartIndex) {
    console.log(cart);
    cartIndex = cartIndex.substring(2, cartIndex.length);   // get number from id
    cartIndex = parseInt(cartIndex);
    cart[cartIndex].qty--;
    total -= cart[cartIndex].price;  // update total

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
    if(cart[cartIndex].qty > 0) {
        qq("qty" + parseInt(cartIndex)).textContent = parseInt(cart[cartIndex].qty);   // redisplay qty
    } else { // qty == 0
        $(".row" + cartIndex).remove();
        ordered.splice(ordered.indexOf(cartIndex), 1);     // remove this item from the ordered array list, since 0 are ordered now
        cart[cartIndex]={};     // set the item index to an empty object. if this item gets added again it will get a new index
    }
    qq("total").innerHTML = "Total: $" + parseFloat(Math.abs(total)).toFixed(2);    // redisplay total
    qq("items_in_cart").textContent = totalQuantity;
    console.log(cart);
};

/* function will return the cartID of the item
 * if the EXACT item already exists in the cart (same ingredients, same options, ect),
 * return the cart index of the previously added matching item instead (so qty is accurate)
 */
var getCartIndex = function(cartIndex) {
    for(var cartNum = 0; cartNum < cart.length; cartNum++) {  // iterate through all previous items in the cart
        if(cart[cartNum] == null) continue;   //if item was removed, continue

        // If name, price, ALL ingredients, and all options do not match, no match
        if(cart[cartIndex].item !== cart[cartNum].item) continue;
        if(cart[cartIndex].price != cart[cartNum].price) continue;
        if(cart[cartIndex].option != cart[cartNum].option) continue;

        if(cart[cartIndex].ingredients.length != cart[cartNum].ingredients.length) continue;    // ingredients list should be the same length
        var differentIngredients = false;   // boolean flag. If any ingredients do not match, set flag to true
        for(var ingredientNum = 0; ingredientNum < cart[cartIndex].ingredients; ingredientNum++) {
            if (cart[cartIndex].ingredients[ingredientNum] !== cart[cartNum].ingredients[ingredientNum]) {
                differentIngredients = true;
                break;
            }
        }
        if(differentIngredients == true) continue;  // no match if any of the ingredients were different

        // check options if applicable


        return cartNum; // the newly added item has an exact match in the cart
    }

    return cartIndex;   // the item does not already exist in the cart
}

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
        cardholderName.setAttribute("onblur", "showFooter()");
        cardholderName.setAttribute("onfocus", "hideFooter()");
        cardholderName.setAttribute("placeholder", "Cardholder Name");
        cardholderName.setAttribute("value", "");
        div.appendChild(cardholderName);

        creditCardNumber = document.createElement("input");
        creditCardNumber.setAttribute("type", "text");
        creditCardNumber.setAttribute("name", "creditCardNumber");
        creditCardNumber.setAttribute("id", "creditCardNumber");
        creditCardNumber.setAttribute("onblur", "showFooter()");
        creditCardNumber.setAttribute("onfocus", "hideFooter()");
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
        netID.setAttribute("onblur", "showFooter()");
        netID.setAttribute("onfocus", "hideFooter()");
        netID.setAttribute("placeholder", "netID");
        netID.setAttribute("value", "");
        div.appendChild(netID);
    }

    qq("paymentMethodPopupContent").appendChild(div);       // add form contents to popup
}

// detect radio button selection change
$(document).on('change', '[type="radio"]', function(){
    if($(this).closest("fieldset").attr("id") === "paymentRadioGroup") {
        paymentMethodSelected($(this).attr('id'));  // pass id of selected radio button
    }
});

// function to clear all items from cart and go back to the menu page with the menu collapsed
var cancelOrder = function() {
    $( "#accordion" ).children().collapsible( "collapse" );     // collapse the collapsible set
    location.reload();      // reloads index.html, reloading entire site
    /*
    orderedCopy = ordered.slice();      // copy of ordered, since ordered is going to be changed by remove1 function

    for(i = 0; i < orderedCopy.length; i++) {   // for every index in the array: ordered
        itemQty = menu[orderedCopy[i]].qty; // save this value, because it will change as each item is removed
        for(qty = 0; qty < itemQty; qty++) {   // for given qty of this item added to cart
            remove1("rm" + orderedCopy[i]); // remove all items in cart (deletes rows, updates totalQuantity and total cost, ect
        }
    }
    */
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

// hides checkout page's footer (when there is keyboard input)
var hideFooter = function() {
   $("#checkoutFooter").css("display", "none");
}

// shows the order page's footer (after text field is no longer in focus)
var showFooter = function() {
    $("#checkoutFooter").show();
}

window.onload = function () {
    loadMenu();
    $("#enterPaymentDetails").hide();   // keep payment method details form hidden until a method is selected
};

