/**
 * Created by Luke Garrison on 12/3/2014.
 */
var qq = function (id) {
	return document.getElementById(id);
};

menu = []; // this will be an array of the food objects. makes menu a global variable
ordered = []; // OBSOLETE. array keeps track of menu index of ordered items. OBSOLETE
total = 0;  // track total cost of items in cart
totalQuantity = 0;  // total number of items in cart (displayed in cart image)
cart = [];          // array to hold all objects that are in cart (item, qty, price, ingredients, options
newlyAddedCartItem = {};	// temporary storage for newly added item instead of immediately attaching unbuild item to the end of the global cart array
notFoundIndex = -1;		// sentinel value for "not found" in an array
ingredientsScrollTolerance = 18;    // tolerance in ingredients popup when scrolling will be activated before the "scroll for more" message is displayed

// opens a popup to customize the item that was clicked
var customizeItemOrder = function (menuIndex) {
	var popupClassName = "customizeItemOrder"; // use this variable to change only the checkout page's item popup

	$(".addToCartButton").attr("onclick", "validateAdd(" + menuIndex + ")");   // set pop-up's "Add" button to send menuIndex to add function
	$("." + popupClassName).width($(window).width());
	$(".customizeItemName").text(menu[menuIndex].item);
	$(".customizeItemPrice").text("$" + menu[menuIndex].price.toFixed(2));
	$(".includedIngredientsLabel").css("display", "inherit");   // display label by default
	$(".customizeItemOptionsLabel").css("display", "none");    // don't display "Options" label by default
	$(".ingredientsList").css("min-width", 0.4 * $(window).width());     // set min-width of checkboxes
	$(".ingredientsList").html("");             // remove previous item's checkboxes, start over fresh
	$(".itemOptions").html("");                 // remove previous item's possible radio group
	$(".itemOptions").css("display", "none");   // default, unless there are options
	$(".itemOptionsMessage").css("display", "none");

	// store an array with all ingredients
	// generate checkboxes of ingredients list
	if (menu[menuIndex].ingredients !== undefined) {
		ingredientsList = menu[menuIndex].ingredients.split(",");
		for (i = 0; i < ingredientsList.length; i++) {
			// label element must have a class and ID in order to grab all checkbox labels later and get their text content
			var newBox = '<label name="ingredientCBLabel" class="ingredientCBLabel' +
				'"><input type="checkbox" name="ingredientCB" checked="true" class="ingredientCB' + i + '"/>' +
				ingredientsList[i] + '</label>';
			$(".ingredientsList").append(newBox).trigger('create');
		}
	}

	// generate radio buttons to select options
	if (menu[menuIndex].options !== undefined) {
		$(".includedIngredientsLabel").css("display", "none");      // hide "ingredients" label
		$(".itemOptions").css("display", "inherit");
		$(".customizeItemOptionsLabel").css("display", "inherit");
		var itemOptions = menu[menuIndex].options;
		var radioGroup = '<fieldset data-role="controlgroup" id="itemOptionsRadioGroup"></fieldset>';
		$(".itemOptions").append(radioGroup);

		for (var option in itemOptions) {
			// create each radio option, which contains an input and a label
			if (itemOptions.hasOwnProperty(option)) {
				var radioOption =
					'<input type="radio" name="radio-itemOption" id="radioItemOption-' + option + '" class="radioItemOption" value="off">' +
					'<label for="radioItemOption-' + option + '" class="itemOptionRadios" id="itemOptionRadios-' + option + '" onclick="removeItemOptionMessage()">' +
						option + ": $" + itemOptions[option] + '</label>';
				// append radio option to radio group
				$("#itemOptionsRadioGroup").append(radioOption).trigger('create');

				// set onclick property to update popup's displayed price on option switch
				var newPrice = itemOptions[option];
				qq("radioItemOption-" + option).setAttribute("onclick", "itemOptionClicked(" + newPrice + ")"); // set property to adjust price displayed at the top of the popup upon radio selection
			}
		}
	}

	customizeItemPart2(menuIndex, popupClassName);     // completes popup setup
};

// opens a popup to re-customize the item that is already in the cart
// This is for the Checkout page popup
var customizeItemCheckout = function(cartIndex) {
	var popupClassName = "customizeItemCheckout";   // use this variable to change only the checkout page's item popup

	$("." + popupClassName).width($(window).width());
	$(".customizeItemName").text(cart[cartIndex].item);
	$(".customizeItemPrice").text("$" + cart[cartIndex].price.toFixed(2));
	$(".includedIngredientsLabel").css("display", "inherit");   // display label by default
	$(".customizeItemOptionsLabel").css("display", "none");    // don't display "Options" label by default
	$(".ingredientsListCheckout").css("min-width", 0.4 * $(window).width());     // set min-width of checkboxes
	$(".ingredientsList").html("");             // remove previous item's checkboxes, start over fresh
	$(".itemOptions").html("");                 // remove previous item's possible radio group
	$(".itemOptionsCheckout").css("display", "none");   // default, unless there are options

	// generate checkboxes of ingredients list - only check the boxes for those that were already checked by user. Others should be unchecked
	if (cart[cartIndex].ingredients.length !== 0) {
		var menuId = cart[cartIndex].menuID;  // get menu ID of item, so a full list of ingredients can be pulled
		var ingredientsList = menu[menuId].ingredients.split(",");  // store an array with all ingredients

		for (i = 0; i < ingredientsList.length; i++) {
			// label element must have a class and ID in order to grab all checkbox labels later and get their text content
			if(cart[cartIndex].ingredients.indexOf(ingredientsList[i]) == -1) {    // if possible ingredient was not checked by the user, keep it unchecked
				var newBox = '<label name="ingredientCBLabel" class="ingredientCBLabel' +
					'"><input type="checkbox" name="ingredientCB" class="ingredientCB' + i + '"/>' +
					ingredientsList[i] + '</label>';
				$(".ingredientsListCheckout").append(newBox).trigger('create');
				$(".ingredientCB-" + i).prop('checked', false).checkboxradio('refresh');
			} else {        // if ingredient was checked by the user
				var newBox = '<label name="ingredientCBLabel" class="ingredientCBLabel' +
					'"><input type="checkbox" name=7"ingredientCB" checked="true" class="ingredientCB' + i + '"/>' +
					ingredientsList[i] + '</label>';
				$(".ingredientsListCheckout").append(newBox).trigger('create');
			}
		}
	}

	// generate radio buttons to select from listed options for item
	if (cart[cartIndex].options !== undefined) {
		$(".includedIngredientsLabel").css("display", "none");      // hide "ingredients" label
		$(".itemOptionsCheckout").css("display", "inherit");
		$(".customizeItemOptionsLabel").css("display", "inherit");
		var itemOptions = cart[cartIndex].options;

		for (var option in itemOptions) {
			if (itemOptions.hasOwnProperty(option)) {
				// create each radio option, which contains an input and a label
				var radioOption =
					'<input type="radio" name="radio-itemOption" id="radioItemOptionCheckout-' + option + '" value="off">' +
					'<label for="radioItemOptionCheckout-' + option + '" class="itemOptionRadios" id="itemOptionRadios-' + option + '">' +
						option + ": $" + itemOptions[option] + '</label>';
				// append radio option to radio group
				$(".itemOptionsCheckout").append(radioOption).trigger('create');

				// select/activate the option the user selected
				if(cart[cartIndex].option === option) {
					$("#radioItemOptionCheckout-" + option).prop("checked", true).checkboxradio("refresh");
				}

				// set onclick property to update popup's displayed price on option switch
				var newPrice = itemOptions[option];
				qq("radioItemOptionCheckout-" + option).setAttribute("onclick", "itemOptionClicked(" + newPrice + ")"); // set property to adjust price displayed at the top of the popup upon radio selection
			}
		}
	}

	// add an onclick event to save the changes made in the popup
	$(".saveItemButton").attr("onclick", "saveItemChanges(" + cartIndex + ")");

	customizeItemPart2(cart[cartIndex].menuID, popupClassName);     // completes popup setup
};

// this portion of the ingredients popup will be the same whether on the order or checkout page's popup
var customizeItemPart2 = function (menuIndex, popupClassName) {
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
	};

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
		console.error("Invalid class name for scrolling div in customize item popup");
	}

	// set image for divider line at the top of popup based on food type
	var imgPath;    // string to store the image path
	imgPath = getHeaderImage(menu[menuIndex]);

	$(".customizeItemColoredLine").css("background-image", "url('" + imgPath + "')");

	// allow background to scroll again after popup closes (in case popup needed scrolling)
	$("." + popupClassName).on("popupafterclose", function (event, ui) {
		$("body.ui-mobile-viewport").css("overflow", "auto");           // re-enables scrolling if required
		$("." + scrollDivClassName).html("");                           // needs to be cleared
	});

	// manually set height on popup so that scrolling will work within the popup
	$("." + popupClassName).css("visibility", "hidden");	// setting visbility prevents content from shifting up when hiding
	$("." + popupClassName).css("height", "");          // reset to default
	$("." + scrollDivClassName).css("height", "");          // reset to default
	$("." + popupClassName).css("padding-bottom", ""); // reset (needs to be increased for scroll-div

	$("body.ui-mobile-viewport").css("overflow", "hidden"); // prevent background from scrolling while popup is open (in case popup needs to scroll)

	var maxHeight = 0.65 * $(window).height();
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
};

// function to change the price displayed in the add item / ingredients popup for items with options (not editable ingredients)
var itemOptionClicked = function(newPrice) {
	newPrice = "$" + newPrice;
	$(".customizeItemPrice").text(newPrice);
	$(".itemOptionsMessage").css("visibility", "hidden");	// "Please select option" message no longer needed after user makes selection
};

/* if item has no options, simply add item to cart
 * if item has options, make sure one is selected before adding item to cart
 * this validate function should only be used when adding item from Order page
 */
var validateAdd = function (menuIndex) {
	if(menu[menuIndex].options === undefined) {
		add(menuIndex);
		$(".customizeItemOrder").popup("close");	// close the popup if item was added
	} else {
		$(".radioItemOption").each(function () {
			if($(this).is(':checked')) {
				add(menuIndex);	// if any option is checked, item can be added to cart
				$(".customizeItemOrder").popup("close");	// close the popup if item was added
				return false;	// breaks out of Jquery's each function
			}
		});

		// none of the item's options were selected. Display the "Select Item Option" message
		$(".itemOptionsMessage").css("display", "block");
		$(".itemOptionsMessage").css("visibility", "visible");
	}
};

// this function takes in the menu index of the item that was selected to be added
var add = function (menuIndex) {
	menuIndex = parseInt(menuIndex);

	// if there are items in cart, don't display "no items in cart" message. (totalQuantity hasn't been updated yet)
	if(totalQuantity >= 0) {
		$("#noOrders").css("display", "none");
	}
	menu[menuIndex].qty++; // adds 1 to the quantity of this item

	// set formatting for cart logo with item count on order page
	if(totalQuantity === 0) {   // just added first item
		qq("items_in_cart").style.paddingRight = "8px";
		qq("items_in_cart").style.visibility="visible";  // show counter label
		qq("cart_logo").src="img/cartWithItems.png"; // use this cart image so that the qty can be overlayed
	} else if(totalQuantity >= 9) { // needs to be shifted for double digits
		qq("items_in_cart").style.paddingRight = "3px";
	}

	// create a new item in the cart with all necessary info to describe the item, from price to ingredients to options
	captureItemDetailsInCart(menuIndex);

	// update the total price of the current cart.
	total+= newlyAddedCartItem.price;

	// will return notFoundIndex if it is the first unique item with all selected ingredients/options, otherwise returns the cart index of the item that is exactly the same
	var cartIndex = getCartIndex();

	if(cartIndex === notFoundIndex) { // the item is new/unique
		cart.push(newlyAddedCartItem);
		cartIndex = cart.length -1;		// newlyAddedCartItem is now at the end of the cart, because it was a unique item
	} else {                          // the exact item is already in the cart once. just update the quantity
		cart[cartIndex].qty++;
	}

	// reset temporary object
	newlyAddedCartItem = {};

	// if 1st time item is being added to cart
	if(cart[cartIndex].qty == 1) {
		var tr = document.createElement("tr"); // create a new row
		tr.setAttribute("class", "lineItemFirstRow row" + parseInt(cartIndex));

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
		item.setAttribute("class", "itemNameCheckout checkoutPage");
		item.setAttribute("onclick", "customizeItemCheckout(" + parseInt(cartIndex) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
		item.setAttribute("colspan", "2");
		tr.appendChild(item);

		// add price
		var price = document.createElement("td");
		price.textContent = " $" + cart[cartIndex].price.toFixed(2);
		price.setAttribute("class", "price checkoutPage");
		tr.appendChild(price);

		qq("orderTable").appendChild(tr);

		// add a paragraph listing of selected ingredients below the line item
		tr = document.createElement("tr");
		tr.setAttribute("class", "row" + parseInt(cartIndex));
		tr.appendChild(document.createElement("td"));   // must skip over 2 cells to place ingredients listing
		tr.appendChild(document.createElement("td"));

		// add each ingredient selected to the checkout page below the line item
		var ingredientsCell = document.createElement("td");
		var ingredientsList = "";

		if(cart[cartIndex].option !== undefined) {
			ingredientsList += cart[cartIndex].option;
		}

		if(cart[cartIndex].ingredients.length > 0 && cart[cartIndex].option !== undefined) {
			ingredientsList+= ": "; // if there are options and ingredients, display: "option: ingredients listing" ie "Regular: strawberries, blueberries"
		}

		for(var i = 0; i < cart[cartIndex].ingredients.length; i++) {
			ingredientsList+= cart[cartIndex].ingredients[i];
			if(i != cart[cartIndex].ingredients.length - 1) ingredientsList += ", ";
		}

		ingredientsCell.textContent = ingredientsList;
		ingredientsCell.setAttribute("class", "ingredientsListing");
		ingredientsCell.setAttribute("onclick", "customizeItemCheckout(" + parseInt(cartIndex) + ")"); // call add method same as "+" button onclick. parseInt deletes the string part
		ingredientsCell.setAttribute("colspan", "2");
		tr.appendChild(ingredientsCell);

		qq("orderTable").appendChild(tr);

		// create row beneath ingredients/options for "Edit" and "Remove" links
		tr = document.createElement("tr");
		tr.setAttribute("class", "lineItemOptions row" + cartIndex);
		tr.appendChild(document.createElement("td"));	// needs one empty cell
		tr.appendChild(document.createElement("td"));

		editLink = document.createElement("td");
		editLink.setAttribute("class", "lineItemOption editItemLink");
		editLink.setAttribute("onclick", "customizeItemCheckout(" + cartIndex + ")");
		editLink.textContent = "Edit";

		removeLink = document.createElement("td");
		removeLink.setAttribute("class", "lineItemOption removeItemLink");
		removeLink.setAttribute("onclick", "remove1(" + cartIndex + ")");
		removeLink.textContent = "Remove";

		tr.appendChild(editLink);
		tr.appendChild(removeLink);

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
// argument will be the cartIndex - the index of the item to be removed is in the cart array
var remove1 = function(cartIndex) {
	cartIndex = parseInt(cartIndex);
	cart[cartIndex].qty--;
	total -= cart[cartIndex].price;  // update total

	// if there are no items in the cart now, change cart icon and go back to main page
	totalQuantity--;
	if(totalQuantity === 0) {
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

/* create a new item in the cart with all necessary info to describe the item
 * Sets the item anem, price, quantity and menuID based on the details in the menu pulled from Parse
 * sets the ingredients and options by inspecting the checkboxes and radio groups
 *
 * The idea is that this cart item can be popped off later if the item already exists in the cart
 */
var captureItemDetailsInCart = function(menuIndex) {
	// capture all useful item information and store in newlyAddedCartItem object. discard later if item is not unique (already in cart)
	newlyAddedCartItem.item = menu[menuIndex].item;
	newlyAddedCartItem.price = menu[menuIndex].price;
	newlyAddedCartItem.qty = 1;
	newlyAddedCartItem.ingredients = [];    // store an array of all ingredients
	newlyAddedCartItem.options = menu[menuIndex].options;
	newlyAddedCartItem.menuID = menuIndex;

	// add all selected ingredients from pop-up to newlyAddedCartItem
	saveIngredients(menuIndex);

	// save options to newlyAddedCartItem
	saveOptions(menuIndex);
};

/* saves ingredients to the newlyAddedCartItem object (global variable)
 * menuIndex is the index of the menu array that the item is at
*/
var saveIngredients = function (menuIndex) {
	// add all selected ingredients from pop-up
	if(menu[menuIndex].ingredients !== undefined) {
		// collect all checkboxes and labels
		var ingredientCheckboxLabels = document.getElementsByName("ingredientCBLabel");
		var ingredientCheckboxes = document.getElementsByName("ingredientCB");

		var checked = $("input[class^='ingredientCB']:checked:enabled");

		// for each CB that is checked, add that label's text content (the ingredient) to the cart object
		for(var i = 0; i < ingredientCheckboxes.length; i++) {
			var checkboxID = ingredientCheckboxes[i].className;
			if ($("." + checkboxID).is(':checked')) {
				newlyAddedCartItem.ingredients.push(ingredientCheckboxLabels[i].textContent);
			}
		}
	}
};

/* saves options to the newlyAddedCartItem object (global variable)
 * menuIndex is the index of the menu array that the item is at
 */
var saveOptions = function(menuIndex) {
	if(menu[menuIndex].options !== undefined) {
		var optionsLabels = document.getElementsByClassName("itemOptionRadios");
		var optionRadios = document.getElementsByName("radio-itemOption");

		// Find the option that is selected. Update price if an option is selected
		for(var i = 0; i < optionRadios.length; i++) {
			var radioID = optionRadios[i].id;
			if($("#" + radioID).is(':checked')) {
				var optionLabel = qq(optionsLabels[i].id).textContent;
				var option = optionLabel.match(/^[^:]*/g);      // grab text from beginning of line up to ":"
				newlyAddedCartItem.option = option[0];                          // update selected option (ie "Regular")
				newlyAddedCartItem.price = menu[menuIndex].options[option[0]];  // update item's price in cart based on option
				break;
			}
		}
	}
};

/* Saves item changes from checkout page's customize item popup
 * Scans all checkboxes and/or options  and creates a new item in the cart (the same way add() does)
 * Use getCartIndex and check to see if the item is already in the cart.
 * If it is, delte the new item that was just added to the cart and simply increase the qty of the
 * matching item by 1.
 */
var saveItemChanges = function(cartIndex) {
	add(cart[cartIndex].menuID);

	// remove the original item that may or may not have been changed, because it has been added back with any changes
	remove1(cartIndex);
	$(".customizeItemCheckout").popup("close");
};

/* function will return the cartID of the item
 * if the EXACT item already exists in the cart (same ingredients, same options, ect),
 * return the cart index of the previously added matching item instead (so qty is accurate)
 * addedItemIndex is the index in the cart that the newly added item is currently at
 */
var getCartIndex = function() {
	for(var cartIndex = 0; cartIndex < cart.length; cartIndex++) {  // iterate through all previous items in the cart
		if(cart[cartIndex] === undefined) continue;   // if item was removed, continue

		// If name, price, ALL ingredients, and all options do not match, no match
		if(newlyAddedCartItem.item !== cart[cartIndex].item) continue;
		if(newlyAddedCartItem.price != cart[cartIndex].price) continue;
		if(newlyAddedCartItem.option != cart[cartIndex].option) continue;

		if(newlyAddedCartItem.ingredients.length != cart[cartIndex].ingredients.length) continue;    // ingredients list should be the same length
		var differentIngredients = false;   // boolean flag. If any ingredients do not match, set flag to true
		for(var ingredientNum = 0; ingredientNum < newlyAddedCartItem.ingredients; ingredientNum++) {
			if (newlyAddedCartItem.ingredients[ingredientNum] !== cart[cartIndex].ingredients[ingredientNum]) {
				differentIngredients = true;
				break;
			}
		}

		if(differentIngredients) continue;  // no match if any of the ingredients were different

		return cartIndex; // the newly added item has an exact match in the cart
	}

	return notFoundIndex;   // the item does not already exist in the cart
};

// open pop-up to confirm payment and order
var submitClicked = function () {
	if(totalQuantity > 0) {
		qq("submitMessage").textContent = "Would you like to confirm your order of $" + total.toFixed(2) + "?"; // set confirmation message
		//$("#submitClicked").popup("open");
		document.activeElement.blur();
		setTimeout(function () {
			$("#submitClicked").popup("open");
		}, 500);
	} else {
		confirm("You have not ordered any items."); // should never occur with automatic transition to menu page when removing last item in cart
	}
};

// open pop-up to enter payment method information upon method selection
var paymentMethodSelected = function(paymentMethod) {
	$("#enterPaymentDetails").show();               // display payment method details form upon radio selection
	qq("paymentMethodPopupContent").innerHTML = ""; // clears the span so that the content can be appended

	div = document.createElement("div");
	div.setAttribute("class", "ui-field-contain");

	if(paymentMethod === "creditCard") {
		$("#creditCardExpDate").show();

		var div2 = document.createElement("div");
		var cardholderName = document.createElement("input");
		cardholderName.setAttribute("type", "text");
		cardholderName.setAttribute("name", "cardholderName");
		cardholderName.setAttribute("id", "cardHolderName");
		cardholderName.setAttribute("onblur", "showFooter()");
		cardholderName.setAttribute("onfocus", "hideFooter()");
		cardholderName.setAttribute("placeholder", "Cardholder Name");
		cardholderName.setAttribute("value", "");
		div2.appendChild(cardholderName);

		var div3 = document.createElement("div");
		var creditCardNumber = document.createElement("input");
		creditCardNumber.setAttribute("type", "text");
		creditCardNumber.setAttribute("name", "creditCardNumber");
		creditCardNumber.setAttribute("id", "creditCardNumber");
		creditCardNumber.setAttribute("onblur", "showFooter()");
		creditCardNumber.setAttribute("onfocus", "hideFooter()");
		creditCardNumber.setAttribute("placeholder", "Credit Card Number");
		creditCardNumber.setAttribute("value", "");
		div3.appendChild(creditCardNumber);
		
		div.appendChild(div2);
		div.appendChild(div3);
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
};

// detect radio button selection change
$(document).on('change', '[type="radio"]', function(){
	if($(this).closest("fieldset").attr("id") === "paymentRadioGroup") {
		paymentMethodSelected($(this).attr('id'));  // pass id of selected radio button
	}
});

// function to open cancel order confirmation popup
var cancelPopup = function() {
	$("#confirmCancelOrder").popup("open");
};

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
};

// function to see if there are any items in the cart or not and decide whether or not to change pages or display a msg
var checkQuantity = function() {     // will determine whether to go to checkout page or not based on # items in cart
	if(totalQuantity === 0) {
		$("#emptyCartMessage").popup("open");
	} else {
		$.mobile.changePage("#order");
	}
};

// function to change to menu page and collapse the accordion
var goToMenu = function() {          // button click will change to menu page
	$( ".menuHeader" ).collapsible( "collapse" );     // collapse the collapsible set by collapsing each section
	$.mobile.changePage("#menu");
};

// function to change to the pickup screen
var goToPickup = function() {
	displayDate();
	$.mobile.changePage("#pickup");
};

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
};

// hides checkout page's footer (when there is keyboard input)
var hideFooter = function() {
   $("#checkoutFooter").css("display", "none");
};

// shows the order page's footer (after text field is no longer in focus)
var showFooter = function() {
	$("#checkoutFooter").show();
};

window.onload = function () {
	$("#enterPaymentDetails").hide();   // keep payment method details form hidden until a method is selected
};

