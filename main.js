const productList = document.getElementById('product-list');
const themeToggle = document.getElementById('theme-toggle');
const categoryFilter = document.getElementById('category-filter');
const priceSort = document.getElementById('price-sort');
const searchBox = document.getElementById('search-box');
const cartToggle = document.getElementById('cart-toggle');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
let products = [];
let cart = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Xatolik yuz berdi:', error);
    }
}

function renderProducts(filteredProducts) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="h-40 w-full object-contain mb-2">
            <h2 class="text-lg font-bold">${product.title}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">Kategoriya: ${product.category}</p>
            <p class="text-blue-500 font-bold">Narxi: $${product.price}</p>
            <button class="add-to-cart p-2 bg-blue-500 text-white rounded mt-2">Savatga Qo‘shish</button>
        `;
        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => addToCart(product, productCard));

        productList.appendChild(productCard);
    });
}

function addToCart(product, productCard) {
    cart.push(product);
    const addedNotification = document.createElement('div');
    addedNotification.className = 'product-added';
    addedNotification.textContent = '+1';
    productCard.appendChild(addedNotification);
    setTimeout(() => addedNotification.remove(), 2000);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = '';
    let totalPrice = 0;
    cart.forEach((product, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex justify-between items-center mb-2';
        cartItem.innerHTML = `
            <div class="flex items-center">
                <img src="${product.image}" alt="${product.title}" class="h-12 w-12 object-contain mr-2">
                <p>${product.title} - $${product.price}</p>
            </div>
            <button class="remove-from-cart text-red-500" data-index="${index}">-</button>
        `;
        const removeFromCartButton = cartItem.querySelector('.remove-from-cart');
        removeFromCartButton.addEventListener('click', () => removeFromCart(index));

        cartItems.appendChild(cartItem);
        totalPrice += product.price;
    });
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

cartToggle.addEventListener('click', () => {
    cartModal.classList.toggle('hidden');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

categoryFilter.addEventListener('change', () => {
    filterAndSortProducts();
});

priceSort.addEventListener('change', () => {
    filterAndSortProducts();
});

searchBox.addEventListener('input', () => {
    filterAndSortProducts();
});

function filterAndSortProducts() {
    let filteredProducts = products;
    const selectedCategory = categoryFilter.value;
    const selectedSort = priceSort.value;
    const searchText = searchBox.value.toLowerCase();

    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    if (searchText) {
        filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchText));
    }

    if (selectedSort === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredProducts);
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle.textContent = '☀️';
} else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
}

fetchProducts();
