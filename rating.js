export default function rating(){
    let rating = 0
    const stars = []
    stars.length = 5
    stars.fill(`<img src="/images/star-outline.svg" alt="star"/>`)
    const starDiv = document.getElementById("stars")
    starDiv.innerHTML = `
        ${stars.map((star, index) => `<span data-rating="${index + 1}" class="outlined-star">${star}</span>`).join("")}
    `
    
    function renderChanges(rating){
        for (let i = 0; i < rating; i++){
            starDiv.children[i].classList.add("star-filled")
        }
        //non-highlight stars after the rating
        for (let i = rating; i < 5; i++){
            starDiv.children[i].classList.remove("star-filled")
        }
      }

      function changeRating(newRating){
        rating = newRating
      }
    
      function getRating(){
        return rating           
      }
    
      function onMouseOver(event){
        let star = event.target.parentElement
        let isStar = star.classList.contains("outlined-star")
        if(isStar){
            let rating = event.target.parentElement.dataset.rating
            renderChanges(rating) 
        }
      }
    
    function onMouseClick(event){
        let star = event.target.parentElement
        console.log(star)
        let isStar = star.classList.contains("outlined-star")
        if(isStar){
            let rating = event.target.parentElement.dataset.rating
            rating = rating === getRating() ? 0 : rating
            renderChanges(rating) 
            changeRating(rating)
        }
    }

    starDiv.addEventListener("mouseover", onMouseOver)
    starDiv.addEventListener("click", onMouseClick)
      
    
}

