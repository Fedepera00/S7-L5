document.addEventListener("DOMContentLoaded", function () {
  fetchProducts(); // Carica i prodotti al caricamento della pagina
});
const fetchProducts = function () {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";

  const productsEndpoint = "https://striveschool-api.herokuapp.com/api/product/";
  const authToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NWFiNDc5YzQ1ZjAwMTU2OWI0YjciLCJpYXQiOjE3Mjc0MjExMDgsImV4cCI6MTcyODYzMDcwOH0.W1-6xzRPoQpjmw4QwBBsYmHgy8XJL4VIn8AB2cSC1X8";
  fetch(productsEndpoint, {
    headers: {
      Authorization: authToken
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Errore nel recupero dei prodotti: ${response.status}`);
      }
    })
    .then((products) => {
      displayProducts(products);
    })
    .catch((error) => {
      console.error("Errore durante il recupero dei prodotti:", error);
      showError("Errore durante il caricamento dei prodotti. Riprova più tardi.");
    })
    .finally(() => {
      spinner.style.display = "none";
    });
};

// Funzione per visualizzare i prodotti sulla pagina
const displayProducts = function (products) {
  const productListHome = document.getElementById("productListHome");
  productListHome.innerHTML = "";
  products.forEach((product) => {
    const card = createProductCard(product);
    productListHome.appendChild(card);
  });
};

// Funzione per creare una card del prodotto
const createProductCard = function (product) {
  const card = document.createElement("div");
  card.className = "col-md-4 product-card";
  card.innerHTML = `
      <div class="card mb-4 shadow-sm">
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" />
        <div class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Prezzo: ${product.price}€</p>
          <button class="btn btn-primary" onclick="redirectToDetails('${product._id}')">Scopri di più</button>
        </div>
      </div>`;
  return card;
};

// Funzione per reindirizzare alla pagina dei dettagli
const redirectToDetails = function (productId) {
  window.location.href = `./dettagli.html?productId=${productId}`;
};

// Funzione per visualizzare un messaggio di errore
const showError = function (message) {
  const errorContainer = document.createElement("div");
  errorContainer.className = "alert alert-danger mt-3";
  errorContainer.innerText = message;
  document.querySelector("main").prepend(errorContainer);
};
