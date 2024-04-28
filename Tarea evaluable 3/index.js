
let allProducts = []; 

        document.addEventListener('DOMContentLoaded', async () => {
            allProducts = await fetchProducts();
            renderProducts(allProducts);
        });

        async function fetchProducts() {
            try {
                const response = await fetch('https://dummyjson.com/products');
                const data = await response.json();
                return data.products; 
            } catch (error) {
                console.error('Error fetching products:', error);
                return [];
            }
        }

        function renderProducts(products) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');

                card.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.brand}">
                    <p>${product.title}</p>
                    <p>Precio: ${product.price}</p>
                    <p>Categoría: ${product.category}</p>
                    <button onclick="addToCart('${product.brand}')">Añadir a carrito</button>
                `;

                resultsDiv.appendChild(card);
            });
        }

        function addToCart(brand) {
            const cartList = document.getElementById('cartList');
            const existingItem = Array.from(cartList.children).find(item => item.dataset.brand === brand);

            if (existingItem) {
                existingItem.querySelector('.quantity').textContent++;
            } else {
                const listItem = document.createElement('li');
                listItem.textContent = `${brand} x1`;
                listItem.dataset.brand = brand;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.onclick = () => removeFromCart(brand);

                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'quantity';
                quantitySpan.textContent = '1';

                listItem.appendChild(quantitySpan);
                listItem.appendChild(deleteButton);
                cartList.appendChild(listItem);
            }

            Swal.fire({
                title: 'Producto añadido',
                text: `Producto de marca ${brand} añadido al carrito.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }

        function removeFromCart(brand) {
            const cartList = document.getElementById('cartList');
            const existingItem = Array.from(cartList.children).find(item => item.dataset.brand === brand);

            if (existingItem) {
                const quantity = parseInt(existingItem.querySelector('.quantity').textContent);

                if (quantity > 1) {
                    existingItem.querySelector('.quantity').textContent = quantity - 1;
                } else {
                    cartList.removeChild(existingItem);
                }
            }
        }

        function applyFilters() {
            const minPrice = parseFloat(document.getElementById('minPrice').value);
            const category = document.getElementById('category').value.trim().toLowerCase();
            const brand = document.getElementById('brand').value.trim().toLowerCase();
        
            // Filtrar productos basados en los criterios
            const filteredProducts = allProducts.filter(product => {
                const passesPriceFilter = isNaN(minPrice) || parseFloat(product.price) >= minPrice;
                const passesCategoryFilter = category === '' || product.category.toLowerCase().includes(category);
                const passesBrandFilter = brand === '' || product.brand.toLowerCase().includes(brand);
        
                return passesPriceFilter && passesCategoryFilter && passesBrandFilter;
            });
        
            renderProducts(filteredProducts);
        }