import menuArray from "/data.js"

const main = document.querySelector("#main")
const menuItems = document.getElementById("menu-items")
const modal = document.getElementById("modal")
const cart = document.getElementById("cart")
const total = document.getElementById("total")
let order = []

let html = ""
menuArray.forEach(item => {
  html += `
    <div class="menu-item" data-id="${item.id}">
      <div class="menu-content">
        <p class="emoji">${item.emoji}</p>
        <div>
          <h3 class="name">${item.name}</h3>
          <p>${item.ingredients}</p>
          <p class="price">$${item.price}
        </div>
      </div>
      <button type="button" class="add-btn" data-add="${item.id}">+</button>
    </div>
  `
}) 
menuItems.innerHTML = html

document.addEventListener("click", function(event){
    const item = menuArray.find(menuItem => menuItem.id == parseInt(event.target.parentElement.dataset.id)
    )
    if(item){
      addToOrder(item)
      calculateTotal() 
    }
    const completeOrderBtn = event.target.closest(".complete-order-btn")
    if(completeOrderBtn){
      completeOrderBtn.addEventListener("click", () => {
        
        modal.showModal()
        document.getElementById("close-btn")?.addEventListener("click", () => {
          modal.close()
        })
        document.getElementById("form").addEventListener("submit", (event) => {
          event.preventDefault()
          modal.close()
          cart.innerHTML = ""
          total.innerHTML = ""
          const message = document.createElement("div")
          message.setAttribute("class", "message")
          message.innerText = "Thanks, your order is on its way!"
          menuItems.append(message)
        })
      })
    }

})

function calculateTotal(){
  const totalPriceArray = Array.from(document.getElementsByClassName("order-price"))
  let total = 0
  let totalPrice = totalPriceArray.map((item) => {
    const itemPrice = parseInt(item.innerText.slice(1))
    return total += itemPrice   
  })  
  totalPrice = totalPrice[totalPrice.length - 1]
  document.getElementById("total-price").innerText = `$${totalPrice}`
}

document.addEventListener("change", (event) => {
  const thisProduct = order.find(item => item.id === parseInt(event.target.dataset.quantity))
  const updatedPrice = parseInt(thisProduct?.price * event.target.value)
 
  document.getElementById(`${thisProduct?.id}`).innerText = `$${updatedPrice}`
  calculateTotal()
})


function addToOrder(item){
  const cartRow = document.createElement("div")
  const alreadyInCart = order.find(cartItem => cartItem.id === item.id)
 
  if(!alreadyInCart){  
    order = [...order, item]  
    console.log(order)
    const cartRowContent =`
      <div class="order" id="${item.name}">
        <div class="order-details">
          <p class="order-name">${item.name}</p>
          <button class="remove-btn">remove</button>
          <span>qty: <input data-quantity="${item.id}"  type="number"     value="1" class="quantity"/></span>
        </div>
        <span id="${item.id}" class="order-price">$${item.price}</span>
        </div>
      ` 
    cartRow.innerHTML += cartRowContent
    if(cartRow.innerHTML){
      cart.style.borderBottom = "1px solid black"
      document.querySelector(".cart-title").style.display = "block"
    }
    cart.appendChild(cartRow)

    const totalHtml = `
        <div class="total-price"><span>Total price:</span> <span id="total-price"></span></div>
        <button id="complete-order-btn" class="complete-order-btn btn">Complete order</button>
      `
    total.innerHTML = totalHtml  
  
  } else if(order.includes(alreadyInCart)) {
    alert("Item already in cart")
  }  

  const removeBtn = document.getElementsByClassName("remove-btn")

  for(let btn of removeBtn){
    btn.addEventListener("click", function(event){
      const target = event.target.parentElement.parentElement
      target.remove()
      order.filter(orderItem => orderItem.itemName !== item.itemName)
      calculateTotal()
    })
  }

}

 
