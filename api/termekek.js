document.addEventListener("DOMContentLoaded", () => {
  const topTermekekRow = document.querySelector("#topTermekekRow");
  const userId = 1; // ide kell majd a bejelentkezett user ID-ja

  fetch('http://localhost:5000/cipok')
    .then(res => res.json())
    .then(cipok => {
      cipok.forEach(cipo => {
        const meretek = Array.isArray(cipo.meretek) ? cipo.meretek : []; // ha nincs meretek, üres tömb
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-4 mb-4";
        col.innerHTML = `
          <div class="card h-100">
            <img src="${cipo.kep}" class="card-img-top img-fluid" alt="${cipo.nev}">
            <div class="card-body">
              <h3 class="h5 card-title">${cipo.nev}</h3>
              <label for="meret-${cipo.id}">Méret:</label>
              <select id="meret-${cipo.id}" class="form-select mb-2">
                ${meretek.map(m => `<option value="${m}">${m}</option>`).join("")}
              </select>
              <div class="row align-items-center">
                <div class="col-6">
                  <button class="btn btn-outline-success w-100 addToCart" 
                    data-id="${cipo.id}" data-name="${cipo.nev}" data-price="${cipo.ar}">
                    Kosárba
                  </button>
                </div>
                <div class="col-6 text-danger fw-bold text-end">${cipo.ar} Ft</div>
              </div>
            </div>
          </div>
        `;
        topTermekekRow.appendChild(col);
      });

      document.querySelectorAll(".addToCart").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          const name = btn.dataset.name;
          const price = parseInt(btn.dataset.price);
          const meretSelect = document.querySelector(`#meret-${id}`);
          const meret = meretSelect ? meretSelect.value : ""; // ha nincs select, üres string

          fetch('http://localhost:5000/kosar/add', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, termekId: id, name, price, meret, darab: 1 })
          })
          .then(res => res.json())
          .then(() => {
            alert(`${name} hozzáadva a kosárhoz!`);
            if (typeof updateCart === "function") updateCart();
          });
        });
      });
    })
    .catch(err => {
      console.error("Hiba a termékek lekérésekor:", err);
    });
});