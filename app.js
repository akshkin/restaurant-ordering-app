import menuArray from "/data.js";
import discount from "./discount.js";
import rating from "./rating.js";

const menuItems = document.getElementById("menu-items");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-btn");
const reviewModal = document.getElementById("review-modal");

const cartEl = document.getElementById("cart");
const totalPriceEl = document.getElementById("total-price");
const discountEl = document.getElementById("discount");
const orderEl = document.getElementById("order");
const completeOrderBtn = document.getElementById("complete-order-btn");

let order = [];

// render menu items
function renderMenuItems() {
  menuItems.textContent = "";
  menuArray.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    const menuContent = document.createElement("menu-content");
    menuContent.classList.add("menu-content");

    const emoji = document.createElement("p");
    emoji.classList.add("emoji");
    emoji.textContent = item.emoji;

    const infoContainer = document.createElement("div");
    const menuName = document.createElement("h3");
    menuName.classList.add("name");
    menuName.textContent = item.name;

    const ingredientsEl = document.createElement("p");
    ingredientsEl.textContent = item.ingredients;

    const priceEl = document.createElement("p");
    priceEl.classList.add("price");
    priceEl.textContent = `$${item.price}`;

    const addBtn = document.createElement("button");
    addBtn.title = "Add to order";
    addBtn.classList.add("add-btn");
    addBtn.textContent = "+";
    addBtn.addEventListener("click", () => addToOrder(item.id));

    infoContainer.append(menuName, ingredientsEl, priceEl);
    menuContent.append(emoji, infoContainer);
    menuItem.append(menuContent, addBtn);
    menuItems.appendChild(menuItem);
  });
}

function addToOrder(id) {
  const item = menuArray.find((menuItem) => menuItem.id === id);

  const alreadyInCart = order.find((cartItem) => cartItem.id === item.id);

  if (!alreadyInCart) {
    order = [...order, { ...item, quantity: 1, price: item.price * 1 }];
    renderOrder();
  } else if (order.includes(alreadyInCart)) {
    alert("Item already in cart");
  }
}

function renderOrder() {
  cartEl.textContent = "";

  orderEl.hidden = false;

  order.forEach((item) => {
    const orderItem = document.createElement("div");
    orderItem.classList.add("order");

    const orderDetails = document.createElement("div");
    orderDetails.classList.add("order-details");

    const orderName = document.createElement("p");
    orderName.classList.add("order-name");
    orderName.textContent = item.name;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "remove";
    removeBtn.addEventListener("click", () => removeItemFromOrder(item.id));

    const quantityEl = document.createElement("div");
    const quantityText = document.createElement("span");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = item.quantity;
    quantityInput.min = 0;
    quantityInput.addEventListener("change", (event) =>
      changeQuantity(event, item.id)
    );

    const orderPrice = document.createElement("p");
    orderPrice.classList.add("order-price");
    orderPrice.textContent = item.newPrice
      ? `$${item.newPrice}`
      : `$${item.price}`;

    quantityEl.append(quantityText, quantityInput);
    orderDetails.append(orderName, removeBtn, quantityEl);
    orderItem.append(orderDetails, orderPrice);
    cartEl.appendChild(orderItem);
  });
  calculateTotal();
}

function removeItemFromOrder(id) {
  order = order.filter((orderItem) => orderItem.id != id);

  renderOrder();
  calculateTotal();
  if (!order.length) resetAll();
}

function changeQuantity(event, id) {
  const thisProduct = order.find((item) => item.id === id);

  if (thisProduct) {
    thisProduct.quantity = event.target.value;

    // check if value is less than 0, if 0 remove product
    if (parseInt(event.target.value) < 1) {
      order = order.filter((item) => item.id !== thisProduct.id);
      renderOrder();
      calculateTotal();
    }
  }
  //   update order with new price to keep reference to original price
  order = order.map((item) => {
    if (thisProduct === item) {
      return {
        ...thisProduct,
        quantity: event.target.value,
        newPrice: thisProduct.quantity * thisProduct.price,
      };
    }
    return item;
  });

  renderOrder();
  calculateTotal();
  if (!order.length) resetAll();
}

function calculateTotal() {
  const totalPrice = order.reduce((acc, current) => {
    if (current.newPrice) {
      return acc + current.newPrice;
    }
    return acc + current.price;
  }, 0);

  //   calculate discount
  const discountAmount = discount(order, totalPrice);
  const discountHtml = `<span>discount</span> <span>-$${discountAmount}</span>`;
  discountEl.innerHTML = `${discountAmount ? discountHtml : ""}`;

  //   calculate total after discount
  const newTotal = totalPrice - discountAmount;
  totalPriceEl.textContent = newTotal ? `$${newTotal}` : `$${totalPrice}`;
}

// reset if order is empty
function resetAll() {
  orderEl.hidden = true;
  order = [];
}

function payOrder() {
  modal.showModal();

  closeBtn.addEventListener("click", () => {
    modal.close();
  });

  document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    modal.close();
    resetAll();

    const name = event.target[0].value;
    const message = document.getElementById("message");
    message.style.display = "block";
    message.innerText = `Thanks ${name}, your order is on its way!`;

    const formFields = event.target;

    // reset form values
    for (let field of formFields) {
      field.value = "";
    }

    setTimeout(() => {
      message.style.display = "none";
    }, 15000);

    // rating modal
    setTimeout(() => {
      reviewModal.showModal();
      rating();
      const starDiv = document.getElementById("stars");

      document
        .getElementById("no-thanks-btn")
        .addEventListener("click", () => reviewModal.close());

      document.getElementById("rating-submit").addEventListener("click", () => {
        starDiv.textContent = "Thank you for your feedback";
        setTimeout(() => {
          reviewModal.close();
        }, 1800);
      });
    }, 2000);
  });
}

// event listeners
completeOrderBtn.addEventListener("click", payOrder);

// on load
renderMenuItems();
