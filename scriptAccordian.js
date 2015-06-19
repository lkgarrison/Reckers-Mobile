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
ingredientsScrollTolerance = 18;    // tolerance in ingredients popup when scrolling will be activated before the "scroll for more" message is displayed

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

    var query = new Parse.Query("Menu");

    query.find().then(function(results) {
        // Add one promise for each item into an array (menu)
        _.each(results, function(result) {
            // Start adding the result to the menu immediately
            menu.push({
                item: result.get("item"),
                type: result.get("type"),
                price: result.get("price"),
                qty: 0,
                description: result.get("description"),
                ingredients: result.get("ingredients"),
                prices: result.get("prices")
            });
        });
        // Return a new promise that is resolved when all items are retrieved and added to the menu array.
        return Parse.Promise.when(menu);

    }, function(error) {
        console.log("Failed to initialize Menu from Parse");
        console.log(error);

    }).then(function() {
        // when menu is entirely downloaded
        displayMenu();
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
        addButton.setAttribute("onClick", "customizeItemOrder(this.id)"); // set onClick property to call the add function, passing the id of the item
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
        item.setAttribute("onClick", "customizeItemOrder(" + parseInt(item.id) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
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
        description.setAttribute("onclick", "customizeItemOrder(" + parseInt(item.id) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
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
    //$(":mobile-pagecontainer").pagecontainer("load", "#order");

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
var customizeItemOrder = function(clicked_id) {
    var popupClassName = "customizeItemOrder"; // use this variable to change only the checkout page's item popup

    $(".addToCartButton").attr("onclick", "add(" + clicked_id + ")");   // set pop-up's "Add" button to send clicked_id to add function
    $("." + popupClassName).width($(window).width());
    $(".customizeItemName").text(menu[clicked_id].item);
    $(".customizeItemPrice").text("$" + menu[clicked_id].price.toFixed(2));
    $(".includedIngredientsLabel").css("display", "inherit");   // display label by default
    $(".customizeItemOptionsHeader").css("display", "none");    // don't display "Options" label by default
    $(".ingredientsList").css("min-width", .4 * $(window).width());     // set min-width of checkboxes
    $(".ingredientsPopupMessage").text("");     // make sure no message is being displayed
    $(".ingredientsList").html("");             // remove previous item's checkboxes, start over fresh
    $(".itemOptions").html("");                 // remove previous item's possible radio group
    $(".itemOptions").css("display", "none");   // default, unless there are options

    // store an array with all ingredients
    // generate checkboxes of ingredients list
    if (menu[clicked_id].ingredients != null) {
        if (menu[clicked_id].ingredients != "") {
            ingredientsList = menu[clicked_id].ingredients.split(",");

            for (i = 0; i < ingredientsList.length; i++) {
                // label element must have a class and ID in order to grab all checkbox labels later and get their text content
                var newBox = '<label name="ingredientCBlabel" class="ingredientCBLabel-' + ingredientsList[i]
                    + '"><input type="checkbox" name="ingredientCB" checked="true" class="ingredientCB-' + i + '"/>'
                    + ingredientsList[i] + '</label>';
                $(".ingredientsList").append(newBox).trigger('create');
            }
        }
    }

    // generate radio buttons to select options
    if (menu[clicked_id].prices != null) {
        $(".includedIngredientsLabel").css("display", "none");      // hide "ingredients" label
        $(".itemOptions").css("display", "inherit");
        $(".customizeItemOptionsHeader").css("display", "inherit");
        var itemOptions = menu[clicked_id].prices;
        var radioGroup = '<fieldset data-role="controlgroup" id="itemOptionsRadioGroup"></fieldset>';
        $(".itemOptions").append(radioGroup);

        for (option in itemOptions) {
            // create each radio option, which contains an input and a label
            if (itemOptions.hasOwnProperty(option)) {
                var radioOption =
                    '<input type="radio" name="radio-itemOption" id="radioItemOption-' + option + '" value="off">' +
                    '<label for="radioItemOption-' + option + '" class="itemOptionRadios" id="itemOptionRadios-' + option + '">'
                        + option + ": $" + itemOptions[option] + '</label>';
                // append radio option to radio group
                $("#itemOptionsRadioGroup").append(radioOption).trigger('create');

                // set onclick property to update popup's displayed price on option switch
                var newPrice = itemOptions[option];
                qq("radioItemOption-" + option).setAttribute("onclick", "setPopupPrice(" + newPrice + ")"); // set property to adjust price displayed at the top of the popup upon radio selection
            }
        }
    }
    customizeItemPart2(clicked_id, popupClassName);     // completes popup setup
}

// opens a popup to re-customize the item that is already in the cart
// This is for the Checkout page popup
var customizeItemCheckout = function(cartID) {
    var popupClassName = "customizeItemCheckout";   // use this variable to change only the checkout page's item popup

    //$(".addToCartButton").attr("onclick", "add(" + cartID + ")");   // set pop-up's "Add" button to send cartID to add function
    $("." + popupClassName).width($(window).width());
    $(".customizeItemName").text(cart[cartID].item);
    $(".customizeItemPrice").text("$" + cart[cartID].price.toFixed(2));
    $(".includedIngredientsLabel").css("display", "inherit");   // display label by default
    $(".customizeItemOptionsHeader").css("display", "none");    // don't display "Options" label by default
    $(".ingredientsListCheckout").css("min-width", .4 * $(window).width());     // set min-width of checkboxes
    $(".ingredientsPopupMessage").text("");     // make sure no message is being displayed
    $(".ingredientsList").html("");             // remove previous item's checkboxes, start over fresh
    $(".itemOptionsCheckout").html("");                 // remove previous item's possible radio group
    $(".itemOptionsCheckout").css("display", "none");   // default, unless there are options

    // store an array with all ingredients
    // generate checkboxes of ingredients list - only check the boxes for those that are already checked
    if (cart[cartID].ingredients != null) {
        if (cart[cartID].ingredients != "") {
            var menu_id = cart[cartID].menuID;  // get menu ID of item, so a full list of ingredients can be pulled
            var ingredientsList = menu[menu_id].ingredients.split(",");

            for (i = 0; i < ingredientsList.length; i++) {
                // label element must have a class and ID in order to grab all checkbox labels later and get their text content
                if(cart[cartID].ingredients.indexOf(ingredientsList[i]) == -1) {    // if possible ingredient was not checked by the user, keep it unchecked
                    var newBox = '<label name="ingredientCBLabel" class="ingredientCBLabel-' + i
                        + '"><input type="checkbox" name="ingredientCB" checked="false" class="ingredientCB-' + i + '"/>'
                        + ingredientsList[i] + '</label>';
                    $(".ingredientsListCheckout").append(newBox).trigger('create');
                    $(".ingredientCB-" + i).prop('checked', false).checkboxradio('refresh');
                } else {        // if ingredient was checked by the user
                    var newBox = '<label name="ingredientCBLabel" class="ingredientCBLabel-' + i
                        + '"><input type="checkbox" name="ingredientCB" checked="true" class="ingredientCB-' + i + '"/>'
                        + ingredientsList[i] + '</label>';
                    $(".ingredientsListCheckout").append(newBox).trigger('create');
                    $(".ingredientCB-" + i).prop('checked', true).checkboxradio('refresh');
                }

            }
        }
    }

    // generate radio buttons to select from listed options for item
    if (cart[cartID].options != null) {
        $(".includedIngredientsLabel").css("display", "none");      // hide "ingredients" label
        $(".itemOptionsCheckout").css("display", "inherit");
        $(".customizeItemOptionsHeader").css("display", "inherit");
        var itemOptions = cart[cartID].options;

        for (option in itemOptions) {
            if (itemOptions.hasOwnProperty(option)) {
                // create each radio option, which contains an input and a label
                var radioOption =
                    '<input type="radio" name="radio-itemOption" id="radioItemOptionCheckout-' + option + '" value="off">' +
                    '<label for="radioItemOptionCheckout-' + option + '" class="itemOptionRadios" id="itemOptionRadios-' + option + '">'
                        + option + ": $" + itemOptions[option] + '</label>';
                // append radio option to radio group
                $(".itemOptionsCheckout").append(radioOption).trigger('create');

                // select/activate the option the user selected
                if(cart[cartID].option === option) {
                    $("#radioItemOptionCheckout-" + option).prop("checked", true).checkboxradio("refresh");
                }

                // set onclick property to update popup's displayed price on option switch
                var newPrice = itemOptions[option];
                qq("radioItemOptionCheckout-" + option).setAttribute("onclick", "setPopupPrice(" + newPrice + ")"); // set property to adjust price displayed at the top of the popup upon radio selection
            }
        }
    }

    // add an onclick event to remove 1 of the item when the "Remove" button is clicked. Also closes the popup
    $(".removeFromCart").attr("onclick",                // set onClick property to call the remove function, passing the id of the item
        "remove1(" + cartID + "); " +
        "$('." + popupClassName + "').popup('close')"
    );

    customizeItemPart2(cart[cartID].menuID, popupClassName);     // completes popup setup, convert to
}

// this portion of the ingredients popup will be the same whether on the order or checkout page's popup
var customizeItemPart2 = function(clicked_id, popupClassName) {
    var getHeaderImage = function(item) {
        switch (item.type) {
            case "pizza":
                imgPath = "img/header_pizza.png";
                break;
            case "piadina":
                imgPath = "img/header_piadina.png";
                break;
            case "americanFare":
                imgPath = "img/header_sandwiches.png";
                break;
            case "salad":
                imgPath = "img/header_salads.png";
                break;
            case "breakfast":
                imgPath = "img/header_breakfast.png";
                break;
            case "side":
                imgPath = "img/header_sides.png";
                break;
            case "smoothie":
                imgPath = "img/header_smoothies.png";
                break;
            default:
                imgPath = "img/header_reckers.png";
        }
        return imgPath;
    }

    // use correct class name for scrolling div based on whether the menu page's popup is called or the checkout page's popup is called
    var scrollDivClassName;
    var buttonWrapper;          // order and checkout pages have separate names because if not, cannot correctly grab height of button wraper div
    // correctly set html references based on which popup is being opened (order vs checkout page)
    if(popupClassName === "customizeItemOrder") {
        scrollDivClassName = "ingredientsList";
        buttonWrapper = "popupButtonWrapper";
    } else if(popupClassName === "customizeItemCheckout") {
        scrollDivClassName = "ingredientsListCheckout";
        buttonWrapper = "popupButtonWrapperCheckout";
    } else {
        console.log("Invalid class name for scrolling div in customize item popup");
    }

    // set image for divider line at the top of popup based on food type
    var imgPath;    // string to store the image path
    imgPath = getHeaderImage(menu[clicked_id]);

    $(".customizeItemColoredLine").css("background-image", "url('" + imgPath + "')");

    // allow background to scroll again after popup closes (in case popup needed scrolling)
    $("." + popupClassName).on("popupafterclose", function (event, ui) {
        $("body.ui-mobile-viewport").css("overflow", "auto");           // re-enables scrolling if required
        $("." + scrollDivClassName).html("");                           // needs to be cleared
    });

    // manually set height on popup so that scrolling will work within the popup
    $("." + popupClassName).css("visibility", "hidden");
    $("." + popupClassName).css("height", "");          // reset to default
    $("." + scrollDivClassName).css("height", "");          // reset to default
    $("." + popupClassName).css("padding-bottom", ""); // reset (needs to be increased for scroll-div

    $("body.ui-mobile-viewport").css("overflow", "hidden"); // prevent background from scrolling while popup is open (in case popup needs to scroll)

    var maxHeight = .65 * $(window).height();
    $("." + popupClassName).css("max-height", maxHeight);       // set max-height of popup, aesthetic purposes
    $("." + popupClassName).popup("open");                      // open but do not show. open in order to extract properties
    var newHeight =  $("." + popupClassName).outerHeight();
    $("." + popupClassName).css("height", newHeight);           // set height to itself - allows popup to be positioned correctly and scroll

    // calculate how much space the ingredients require to be displayed, even if this height is too large to fit in the popup without scrolling enabled
    var scrollDivHeight = $("." + scrollDivClassName).height();

    // calculate actual height that the dispaly content will take up (can be affected by popup's maximum height
    var ingredientsHeight = $("." + popupClassName).outerHeight() - $("." + scrollDivClassName).position().top - $("." + buttonWrapper).outerHeight();

    // scrolling must be enabled (by manually setting height) if the div needs more room than it has to display ingredients
    var requiresScrolling = scrollDivHeight > ingredientsHeight;

  /* set popup height and scrolling based on how much space the ingredients list takes up: */
    // for when "scroll for more appears" but only one ingredient is only half way cut off or less: don't show "scroll for more" message
    if(requiresScrolling && (scrollDivHeight - ingredientsScrollTolerance) < ingredientsHeight) {
        $("." + scrollDivClassName).css("height", ingredientsHeight); // specifically set height to enable scrolling
        $(".scrollForMore").css("display", "none");     // don't display "scroll for more message" b/c only short by a few pixels
    }
    // if ingredients list needs to be scrollable because there are more ingredients than can fit inside the popup
    else if(requiresScrolling) {      // if height of container of ingredients > max height of area to display, add scrolling
        $("." + scrollDivClassName).css("height", ingredientsHeight); // specifically set height to enable scrolling
        $(".scrollForMore").css("display", "block");    // make sure "scroll for more" message is displayed
    }
    // if there are only a few ingredients - there is extra room in the popup: only make popup as tall as it needs to be
    else {
        $(".scrollForMore").css("display", "none");         // don't display "scroll for more message, not applicable"
    }

    $("." + popupClassName).css("visibility", "visible");   // make popup visible now that all properties are correctly set
}

// function to change the price displayed in the add item / ingredients popup
var setPopupPrice = function(newPrice) {
    newPrice = "$" + newPrice;
    $(".customizeItemPrice").text(newPrice);
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

    /* will return cartCounter if it is the first unique item will all selected ingredients, otherwise returns
     * the cart index of the item that is exactly the same
     */

    // capture all useful item information and store in new cart index. discard later if item is not unique (already in cart)
    cart.push({});              // push a blank object onto the array
    cart[cartCounter]["item"] = menu[clicked_id].item;
    cart[cartCounter]["price"] = menu[clicked_id].price;
    cart[cartCounter]["qty"] = 1;
    cart[cartCounter]["ingredients"] = [];    // store an array of all ingredients
    cart[cartCounter]["options"] = menu[clicked_id].prices;
    cart[cartCounter]["menuID"] = clicked_id;

    // add all selected ingredients from pop-up
    if(menu[clicked_id].ingredients != null) {
        // collect all checkboxes and labels
        var ingredientCheckboxLabels = document.getElementsByName("ingredientCBlabel");
        var ingredientCheckboxes = document.getElementsByName("ingredientCB");

        // for each CB that is checked, add that label's text content (the ingredient) to the cart object
        for(var i = 0; i < ingredientCheckboxes.length; i++) {
            var checkboxID = ingredientCheckboxes[i].className;
            if ($("." + checkboxID).is(':checked')) {
                cart[cartCounter]["ingredients"].push(ingredientCheckboxLabels[i].textContent);

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
                var option = optionLabel.match(/^[^:]*/g);      // grab text from beginning of line up to ":"
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
    if(cart[cartIndex].qty == 1) {
        var tr = document.createElement("tr"); // create a new row
        tr.setAttribute("class", "row" + parseInt(cartIndex));

        // create div for remove button
        var wrapper = document.createElement("div");
        wrapper.setAttribute("class", "rmButtonWrapper");

        // every time an item is added, give it a remove button
        var button = document.createElement("td");
        button.setAttribute("id", "rm" + parseInt(cartIndex));       // assign a unique id to the button that is the item name. this id it the menu index of the item
        button.setAttribute("onClick", "remove1(" + cartIndex + ")"); // set onClick property to call the remove function, passing the id of the item
        button.setAttribute("type", "button");
        button.setAttribute("class", "removeButton");
        button.setAttribute("value", "");
        button.setAttribute("data-role", "none");
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
        item.setAttribute("onclick", "customizeItemCheckout(" + parseInt(cartIndex) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
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
        ingredientsCell.setAttribute("onclick", "customizeItemCheckout(" + parseInt(cartIndex) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
        tr.appendChild(ingredientsCell);

        qq("orderTable").appendChild(tr);

        ordered.push(cartIndex);   // adds this item's menu index to the ordered array, to make sure it can't be added again (only adjust quantity)

    // menu item has already been added. just adjust the quantity
    } else {
        qq("qty" + parseInt(cartIndex)).textContent = parseInt(cart[cartIndex].qty);
    }

    // update total quantity and total cost displayed
    qq("items_in_cart").textContent = ++totalQuantity;
    qq("total").innerHTML = "Total: $" + parseFloat(Math.abs(total)).toFixed(2);  // update total
};

// trigger when remove button is clicked on checkout page to remove one instance of an item
// argument will be the cartIndex - the index the item to be removed is in the cart array
var remove1 = function(cartIndex) {
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


// function to open cancel order confirmation popup
var cancelPopup = function() {
    $("#confirmCancelOrder").popup("open");
}

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

