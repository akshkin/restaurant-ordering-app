import menuArray from "/data.js"
import discount from "./discount.js"
import rating from "./rating.js"

const main = document.querySelector("#main")
const menuItems = document.getElementById("menu-items")
const modal = document.getElementById("modal")

const cart = document.getElementById("cart")
const cartTitle = document.getElementById("cart-title")
const total = document.getElementById("total")
let order = []

function renderMenuItems(){
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
          <button type="button" class="add-btn" data-add="${item.id}" aria-label="add to cart">+</button>
        </div>
      `
    }) 
    menuItems.innerHTML = html
    
    const addBtns = Array.from(document.getElementsByClassName("add-btn")) 
    console.log(addBtns)
    addBtns.forEach(btn => {
      btn.addEventListener("click", (event) => {
          const item = menuArray.find(menuItem => menuItem.id == parseInt(event.target.dataset.add)
          )
          if(item){
              addToOrder(item)
              calculateTotal() 
          } 
      })
    })

}

renderMenuItems()

function renderOrder(){
    let html = ""
    if(!order.length) return html = ""
    order.forEach(item => {
      html +=`
        <div class="order" style="transform: translateX(0%)" id="${item.id}">
          <div class="order-details">
            <p class="order-name">${item.name}</p>
            <button class="remove-btn" data-remove="${item.id}">remove</button>
            <span>qty: <input data-quantity="${item.id}"  type="number"     value="${item.quantity}" class="quantity"/></span>
          </div>
          <span id="item-${item.id}" class="order-price">$${item.newPrice ? item.newPrice : item.price}</span>
        </div>
      `  
    })
    return cart.innerHTML = html
} 

cart.addEventListener("click", event => {
    const removeBtn = event.target.dataset.remove
   
    if(removeBtn){
        const orderDiv = event.target.parentElement.parentElement
        orderDiv.classList.add("active")
        console.log(orderDiv)
        order = order.filter(orderItem => orderItem.id != removeBtn)

        renderOrder()
        calculateTotal()
        if (!order.length){
            noStyle()
        }
    }
})

function closeModal(modal){
    modal.setAttribute("closing", "")
    modal.addEventListener("animationend", () => {
        modal.removeAttribute("closing")
        modal.close()         
    }, {once:true})
}

main.addEventListener("click", function(event){
    const completeOrderBtn = event.target.closest(".complete-order-btn")

    if(completeOrderBtn){
        modal.showModal()        

        document.getElementById("close-btn")?.addEventListener("click", () => {
           closeModal(modal)
        })

        document.getElementById("form").addEventListener("submit", (event) => {
            event.preventDefault()
            modal.close()
            noStyle()
            order = []
            const name = event.target[0].value
            const message = document.getElementById("message")
            message.style.display = "block"
            message.innerText = `Thanks ${name}, your order is on its way!`
            const formFields = event.target
            for(let field of formFields){
                field.value = ""
            }
          

          setTimeout(() => {
              message.style.display = "none"
          }, 15000)

          const reviewModal = document.getElementById("review-modal")
          
          setTimeout(() => {
              reviewModal.showModal()
              rating()
              const starDiv = document.getElementById("stars")
              
              document.getElementById("no-thanks-btn").addEventListener("click", () => reviewModal.close())
    
              document.getElementById("rating-submit").addEventListener("click", () => {
                starDiv.innerHTML = `<p>Thank you for your feedback</p>` 
                setTimeout(() => {
                      closeModal(reviewModal)
                }, 1800)
              })
  
          }, 2000)

        }) 
        
    }

})


function calculateTotal(){
    const totalPrice = order.reduce((acc, current) => {
        if(current.newPrice){
            return acc + current.newPrice
        }
        return acc + current.price 
    },0) 
    const discountAmount = discount(order, totalPrice)
    const discountHtml = `<span>discount</span> <span>-$${discountAmount}</span>`
    const discountEl = document.getElementById("discount") 
    discountEl.innerHTML = `${discountAmount ? discountHtml : ""}`
    const newTotal = totalPrice - discountAmount
    document.getElementById("total-price").innerText = `$${newTotal ? newTotal : totalPrice}`
}

function noStyle(){
    cart.innerHTML = ""
    cartTitle.style.display = "none"
    cart.style.border = "none"
    cart.style.transform = "translateX(0%)"
    total.innerHTML = ""
}

cart.addEventListener("change", (event) => {
    const thisProduct = order.find(item => item.id === parseInt(event.target.dataset.quantity))

    if(thisProduct){
        thisProduct.quantity = event.target.value

        if (parseInt(event.target.value) === 0){
            order = order.filter(item => item.id !== thisProduct.id)
            renderOrder()
            calculateTotal()
            if (!order.length){
              noStyle()
            }
        }
    }
    order = order.map(item => {
        if(thisProduct === item){
            return {...thisProduct, quantity: event.target.value, newPrice: thisProduct.quantity * thisProduct.price}
        }
        return item
    })
    const updatedPrice = parseInt(thisProduct?.newPrice)
  
    document.getElementById(`item-${thisProduct?.id}`).innerText = `$${updatedPrice}`
    renderOrder()
    calculateTotal()
})


function addToOrder(item){
    const alreadyInCart = order.find(cartItem => cartItem.id === item.id)
   
    if(!alreadyInCart){  
        order = [...order, {...item, quantity: 1}]   
        renderOrder()

      if(cart.innerHTML){
          cart.style.transform = "translateX(0%)"
          cart.style.borderBottom = "1px solid black"        
          cartTitle.style.display = "block"
      }
      const totalHtml = `
          <div class="justify-space-between total-price">
            <span>Total price:</span> <span id="total-price"></span>
          </div>
          <button id="complete-order-btn" class="complete-order-btn btn">
            Complete order
          </button>
        `
      total.innerHTML = totalHtml 
     
  } else if(order.includes(alreadyInCart)) {
      alert("Item already in cart")
  }  
}

 
