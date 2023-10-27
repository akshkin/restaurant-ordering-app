const slides = document.getElementsByClassName("carousal-item")
let slidePosition = 0
const totalSlides = slides.length

function hideAllSlides(){
    for(let slide of slides){
        slide.classList.add("hide")
        slide.classList.remove("visible")
    }
}

function showSlides(){
    slides[slidePosition].classList.add("visible")
}

function prevSlide(){
    hideAllSlides()
    slidePosition === 0 ? slidePosition = totalSlides - 1 : slidePosition--

    showSlides()
}

function nextSlide(){
    hideAllSlides()
    slidePosition === (totalSlides - 1) ? slidePosition = 0 : slidePosition++

    showSlides()
}

setInterval(nextSlide, 7000)