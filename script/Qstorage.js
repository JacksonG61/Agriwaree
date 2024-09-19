document.addEventListener('DOMContentLoaded', function () {
    const productStocks = {
        "ជី DAP": 20,
        "ជី A-An": 17,
        "ជី NP": 25,
        "ជី N": 40,
        "ថ្នាំ​": 20,
        // Add more products and their stock values here
    };

    function initializeStock() {
        Object.keys(productStocks).forEach(productName => {
            const stockKey = `${productName}-stock`;
            if (localStorage.getItem(stockKey) === null) {
                localStorage.setItem(stockKey, productStocks[productName]);
            }
        });
    }

    function updateStockDisplay(productName) {
        const stockElement = document.querySelector(`.product-card[data-product-name="${productName}"] .stock-quantity`);
        if (!stockElement) {
            console.error(`Stock element not found for ${productName}`);
            return;
        }
        const stockKey = `${productName}-stock`;
        const stockQuantity = parseInt(localStorage.getItem(stockKey)) || 0;
        stockElement.textContent = stockQuantity;
    }

    function finalizePurchase(productName, quantity) {
        const stockKey = `${productName}-stock`;
        let currentStock = parseInt(localStorage.getItem(stockKey));
        if (currentStock >= quantity) {
            currentStock -= quantity;
            localStorage.setItem(stockKey, currentStock);
            updateStockDisplay(productName); // Update stock display in HTML after successful purchase
        } else {
            console.error('Not enough stock to finalize the purchase');
        }
    }

    function handleProductStock(productCard) {
        const productName = productCard.querySelector('.product-name').textContent.trim();
        const stockElement = productCard.querySelector('.stock-quantity');
        const stockKey = `${productName}-stock`;

        let stockQuantity = parseInt(localStorage.getItem(stockKey));
        if (isNaN(stockQuantity)) {
            stockQuantity = 0;
        }
        stockElement.textContent = stockQuantity;

        const addToCartButton = productCard.querySelector('.add-to-cart');
        const quantityDisplay = productCard.querySelector('.quantity');
        const increaseButton = productCard.querySelector('button[data-action="increase"]');
        const decreaseButton = productCard.querySelector('button[data-action="decrease"]');

        // Update the display of the buttons based on stock availability
        function updateButtonState() {
            let currentQuantity = parseInt(quantityDisplay.textContent);
            let currentStock = parseInt(localStorage.getItem(stockKey));

            // Disable the increase button if the quantity is at stock limit
            if (currentQuantity >= currentStock) {
                increaseButton.disabled = true;
            } else {
                increaseButton.disabled = false;
            }

            // Ensure decrease button can't reduce below 1
            decreaseButton.disabled = currentQuantity <= 1;
        }

        addToCartButton.addEventListener('click', function () {
            const selectedQuantity = parseInt(quantityDisplay.textContent);
            let currentStock = parseInt(localStorage.getItem(stockKey));

            if (currentStock >= selectedQuantity) {
                // Proceed to checkout without updating stock here
                alert(`Added ${selectedQuantity} ${productName} to cart. Complete the purchase to update stock.`);
            } else {
                alert(`Insufficient stock for ${productName}. Only ${currentStock} left.`);
            }
        });

        productCard.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function () {
                const action = this.getAttribute('data-action');
                let currentQuantity = parseInt(quantityDisplay.textContent);
                const maxStock = parseInt(localStorage.getItem(stockKey));

                if (action === 'increase') {
                    if (currentQuantity < maxStock) {
                        quantityDisplay.textContent = currentQuantity + 1;
                    }
                } else if (action === 'decrease' && currentQuantity > 1) {
                    quantityDisplay.textContent = currentQuantity - 1;
                }

                // Update the button states after each click
                updateButtonState();
            });
        });

        // Initially update button states
        updateButtonState();

        if (parseInt(stockElement.textContent) === 0) {
            addToCartButton.disabled = true;
        }
    }

    initializeStock();

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        handleProductStock(card);
    });
});
