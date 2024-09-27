document.addEventListener("DOMContentLoaded", function () {
  const productId = new URLSearchParams(location.search).get("productId");

  if (productId) {
    fetchProductDetails(productId);
  } else {
    console.error("ID del prodotto non valido");
  }
});

// Funzione per recuperare i dettagli del prodotto
const fetchProductDetails = function (productId) {
  const productDetailsEndpoint = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
  const authToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NWFiNDc5YzQ1ZjAwMTU2OWI0YjciLCJpYXQiOjE3Mjc0MjExMDgsImV4cCI6MTcyODYzMDcwOH0.W1-6xzRPoQpjmw4QwBBsYmHgy8XJL4VIn8AB2cSC1X8";

  fetch(productDetailsEndpoint, {
    headers: {
      Authorization: authToken
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Errore nel recupero dei dettagli del prodotto: ${response.status}`);
      }
    })
    .then((productDetails) => {
      displayProductDetails(productDetails);
    })
    .catch((error) => {
      console.error("Errore durante il recupero dei dettagli del prodotto:", error);
    });
};

// Funzione per visualizzare i dettagli del prodotto
const displayProductDetails = function (productDetails) {
  const productDetailsContainer = document.getElementById("productDetails");

  productDetailsContainer.innerHTML = `
      <div class="card mb-4 shadow-sm">
        <img src="${productDetails.imageUrl}" class="card-img-top" alt="${productDetails.name}"/>
        <div class="card-body text-center">
          <h5 class="card-title">${productDetails.name}</h5>
          <p class="card-text">${productDetails.description}</p>
          <p class="card-text"><strong>Prezzo:</strong> ${productDetails.price}€</p>
        </div>
      </div>`;
};
