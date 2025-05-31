const originFilter = document.querySelector('select:nth-of-type(2)');
const roastFilter = document.querySelector('select:nth-of-type(1)');
const sortSelect = document.querySelector('select:nth-of-type(3)');
const productCards = document.querySelectorAll('#product-list > div');

function filterProducts() {
const roast = roastFilter.value;
const origin = originFilter.value;

productCards.forEach(card => {
    const cardRoast = card.getAttribute('data-roast');
    const cardOrigin = card.getAttribute('data-origin');
    let visible = true;

    if (roast !== 'Röstgrad Filter' && roast !== '' && roast !== cardRoast) visible = false;
    if (origin !== 'Herkunftsland Filter' && origin !== '' && origin !== cardOrigin) visible = false;

    card.style.display = visible ? '' : 'none';
});
}

function sortProducts() {
const list = document.getElementById('product-list');
const sorted = Array.from(productCards).sort((a, b) => {
    const priceA = parseFloat(a.getAttribute('data-price'));
    const priceB = parseFloat(b.getAttribute('data-price'));
    return sortSelect.value === 'Preis aufsteigend' ? priceA - priceB : priceB - priceA;
});
sorted.forEach(card => list.appendChild(card));
}

[originFilter, roastFilter].forEach(select => select.addEventListener('change', filterProducts));
sortSelect.addEventListener('change', () => {
sortProducts();
filterProducts();
});