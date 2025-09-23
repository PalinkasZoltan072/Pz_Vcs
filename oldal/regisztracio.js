// kiválasztjuk az elemeket querySelector-ral
const form = document.querySelector("Form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const valasz = document.querySelector("#valasz");

// regisztralokgomb submitolasa eseten =>
form.addEventListener("submit", (e) => {
  e.preventDefault(); 

  // objektum 
  const adat = {
    username: username.value,
    email: email.value,
    password: password.value
  };

  // fetch POST => hozzáadunk vmi újat itt az adatokat
  fetch("http://localhost:3000/mukodj", { // a szerver.php helyere majd a Node.js es backend utvonal jön? 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(adat) // objektum átalakítása JSON-ná
  })
  .then(response => response.json())   
  .then(data => {
    // kiiras
    valasz.textContent = data.message;
  })
  .catch(error => {
    valasz.textContent = "Hiba történt!";
    console.error("Fetch hiba:", error);
  });
});
