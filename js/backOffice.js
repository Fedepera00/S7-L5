document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("productForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (this.dataset.productId) {
      updateProduct(this.dataset.productId);
    } else {
      createProduct();
    }
  });

  fetchProducts(); // Carica i prodotti quando la pagina viene caricata
});

// Funzione per mostrare un messaggio di errore
const showError = function (message) {
  const errorContainer = document.createElement("div");
  errorContainer.className = "alert alert-danger mt-3";
  errorContainer.innerText = message;
  document.querySelector("main").prepend(errorContainer);
};

// Funzione per recuperare i prodotti dall'API
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

// Funzione per visualizzare i prodotti nel back-office
const displayProducts = function (products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = ""; // Pulisco la lista già esistente

  products.forEach((product) => {
    const card = createProductCard(product);
    productList.appendChild(card);
  });
};

// Funzione per creare una card prodotto con i pulsanti Modifica ed Elimina
const createProductCard = function (product) {
  const card = document.createElement("div");
  card.className = "col-md-4 product-card";
  card.innerHTML = `
      <div class="card mb-4 shadow-sm">
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}"/>
        <div class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Prezzo: ${product.price}€</p>
          <button class="btn btn-primary" onclick="populateForm('${product._id}')">Modifica</button>
          <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Elimina</button>
        </div>
      </div>`;
  return card;
};

// Funzione per popolare il form con i dati del prodotto da modificare
const populateForm = function (productId) {
  const productsEndpoint = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
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
        throw new Error(`Errore nel recupero del prodotto: ${response.status}`);
      }
    })
    .then((product) => {
      document.getElementById("productNome").value = product.name;
      document.getElementById("productDescrizione").value = product.description;
      document.getElementById("productBrand").value = product.brand;
      document.getElementById("productFoto").value = product.imageUrl;
      document.getElementById("productPrezzo").value = product.price;

      const form = document.getElementById("productForm");
      form.dataset.productId = productId; // Imposta il dataset per memorizzare l'ID del prodotto
      document.getElementById("createProductBtn").textContent = "Modifica Prodotto";
    })
    .catch((error) => {
      console.error("Errore durante il caricamento del prodotto per modifica:", error);
      showError("Errore durante il caricamento del prodotto. Riprova più tardi.");
    });
};

// Funzione per creare un nuovo prodotto
const createProduct = function () {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";

  const productName = document.getElementById("productNome").value;
  const productDescription = document.getElementById("productDescrizione").value;
  const productBrand = document.getElementById("productBrand").value;
  const productFoto = document.getElementById("productFoto").value;
  const productPrezzo = parseFloat(document.getElementById("productPrezzo").value);

  const createProductEndpoint = "https://striveschool-api.herokuapp.com/api/product/";
  const authToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NWFiNDc5YzQ1ZjAwMTU2OWI0YjciLCJpYXQiOjE3Mjc0MjExMDgsImV4cCI6MTcyODYzMDcwOH0.W1-6xzRPoQpjmw4QwBBsYmHgy8XJL4VIn8AB2cSC1X8";

  fetch(createProductEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken
    },
    body: JSON.stringify({
      name: productName,
      description: productDescription,
      brand: productBrand,
      imageUrl: productFoto,
      price: productPrezzo
    })
  })
    .then((response) => {
      if (response.ok) {
        alert("Prodotto creato con successo!");
        document.getElementById("productForm").reset();
        fetchProducts(); // Ricarica i prodotti
      } else {
        throw new Error(`Errore nella creazione del prodotto: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Errore durante la creazione del prodotto:", error);
      showError("Errore durante la creazione del prodotto. Riprova più tardi.");
    })
    .finally(() => {
      spinner.style.display = "none";
    });
};

// Funzione per modificare un prodotto esistente
const updateProduct = function (productId) {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";

  const productName = document.getElementById("productNome").value;
  const productDescription = document.getElementById("productDescrizione").value;
  const productBrand = document.getElementById("productBrand").value;
  const productFoto = document.getElementById("productFoto").value;
  const productPrezzo = parseFloat(document.getElementById("productPrezzo").value);

  const updateProductEndpoint = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
  const authToken =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NWFiNDc5YzQ1ZjAwMTU2OWI0YjciLCJpYXQiOjE3Mjc0MjExMDgsImV4cCI6MTcyODYzMDcwOH0.W1-6xzRPoQpjmw4QwBBsYmHgy8XJL4VIn8AB2cSC1X8";

  fetch(updateProductEndpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken
    },
    body: JSON.stringify({
      name: productName,
      description: productDescription,
      brand: productBrand,
      imageUrl: productFoto,
      price: productPrezzo
    })
  })
    .then((response) => {
      if (response.ok) {
        alert("Prodotto modificato con successo!");
        document.getElementById("productForm").reset();
        fetchProducts();
      } else {
        throw new Error(`Errore nella modifica del prodotto: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Errore durante la modifica del prodotto:", error);
      showError("Errore durante la modifica del prodotto. Riprova più tardi.");
    })
    .finally(() => {
      spinner.style.display = "none";
      document.getElementById("createProductBtn").textContent = "Crea Prodotto"; // Torna al pulsante di creazione
      delete document.getElementById("productForm").dataset.productId; // Rimuove l'ID dal form per evitare conflitti
    });
};

// Funzione per eliminare un prodotto
const deleteProduct = function (productId) {
  if (confirm("Vuoi davvero eliminare questo prodotto?")) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

    const deleteProductEndpoint = `https://striveschool-api.herokuapp.com/api/product/${productId}`;
    const authToken =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NWFiNDc5YzQ1ZjAwMTU2OWI0YjciLCJpYXQiOjE3Mjc0MjExMDgsImV4cCI6MTcyODYzMDcwOH0.W1-6xzRPoQpjmw4QwBBsYmHgy8XJL4VIn8AB2cSC1X8";

    fetch(deleteProductEndpoint, {
      method: "DELETE",
      headers: {
        Authorization: authToken
      }
    })
      .then((response) => {
        if (response.ok) {
          alert("Prodotto eliminato con successo!");
          fetchProducts();
        } else {
          throw new Error(`Errore nella cancellazione del prodotto: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Errore durante la cancellazione del prodotto:", error);
        showError("Errore durante la cancellazione del prodotto. Riprova più tardi.");
      })
      .finally(() => {
        spinner.style.display = "none";
      });
  }
};
