export default function discount(arr, total) {
  const discountEl = document.getElementById("discount");
  const food = arr.find((item) => item.category === "food");
  const drink = arr.find((item) => item.category === "drink");
  let discountAmount = 0;

  if (discountEl) {
    if (arr.includes(food) && arr.includes(drink)) {
      const discount = 15;
      discountAmount = (discount * total) / 100;
      discountEl.style.paddingBlock = "1em";
      discountEl.style.display = "flex";
    } else {
      discountEl.style.paddingBlock = "0";
      discountEl.style.display = "none";
    }
  }

  return discountAmount;
}
