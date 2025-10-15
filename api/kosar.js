const userId = 1; // ide kell majd a bejelentkezett user ID-ja

function updateCart() {
  fetch(`http://localhost:5000/kosar/${userId}`)
    .then(res => res.json())
    .then(cart => {
      const cartItems = document.querySelector("#cartItems");
      const totalPrice = document.querySelector("#totalPrice");
      cartItems.innerHTML = "";
      let total = 0;

      cart.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          ${item.nev} (${item.meret}) x ${item.darab}
          <span>${item.ar * item.darab} Ft</span>
          <button class="btn btn-sm btn-danger ms-2 removeItem">Törlés</button>
        `;
        li.querySelector(".removeItem").addEventListener("click", () => {
          fetch('http://localhost:5000/kosar/remove', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id })
          }).then(() => updateCart());
        });
        cartItems.appendChild(li);
        total += item.ar * item.darab;
      });

      totalPrice.textContent = total;
    });
}

document.querySelector("#clearCart")?.addEventListener("click", () => {
  fetch('http://localhost:5000/kosar/clear', {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  }).then(() => updateCart());
});

document.querySelector("#placeOrder")?.addEventListener("click", () => {
  fetch("http://localhost:5000/kosar/placeOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })
  .then(res => res.json())
  .then(() => {
    alert("Rendelés sikeresen leadva!");
    updateCart();
  });
});

// Oldal betöltésekor kosár frissítése
document.addEventListener("DOMContentLoaded", updateCart);