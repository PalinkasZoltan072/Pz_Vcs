const form = document.querySelector("form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const valasz = document.querySelector("#valasz");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const adat = {
    username: username.value,
    email: email.value,
    password: password.value
  };

  fetch("http://localhost:3000/felhasznalo/regisztral", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adat)
  })
  .then(response => response.json())
  .then(data => {
    valasz.textContent = data.message;
  })
  .catch(error => {
    valasz.textContent = "Hiba történt!";
    console.error("Fetch hiba:", error);
  });
});