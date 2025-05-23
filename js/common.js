// Function to handle image source change
function handleViewportResize(entries) {
    entries.forEach(entry => {
        if (entry.contentRect.width < 821) {
        } else {
        }
    });
}

function formatPriceInINR(price) {    
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

function handleRoute(link) {
    window.location.href = link;
}
 
var priceRange;

function handleBudgetRoute(is_rog = false){
    if(priceRange === undefined){
        priceRange='less_than_40000';
    }

    if(is_rog)
    {
        window.location.href=`/rog-listing.html?price_range=${priceRange}`
    }
    else
    {
        window.location.href=`/listing.html?price_range=${priceRange}`
    }
}

function handleSection(productId) {
    document.querySelectorAll('#specs-list').forEach(section => {
        if (document.getElementById(`see-more-text_${productId}`).innerHTML === 'See Less') {
            section.style.transition = 'all .7s ease-in';
            section.style.maxHeight = '0px';
            section.style.height = '0px';

        } else {
            section.style.maxHeight = '200px';
            section.style.height = 'auto';
            section.style.transition = 'all .7s ease-out';

        }
    });
    document.querySelectorAll(`#see-more-text_${productId}`).forEach(text => {
        if (text.innerHTML === 'See More') {
            text.innerHTML = 'See Less';
        } else if (text.innerHTML == 'See Less') {
            text.innerHTML = 'See More';
        } else {
            text.innerHTML = 'See Less';
        }
    });

    document.querySelectorAll(`#arrow-down_${productId}`).forEach(arrow => {
        if (document.getElementById(`see-more-text_${productId}`).innerHTML === 'See Less') {
            arrow.style.transform = 'rotate(180deg)';
            arrow.style.position = 'relative';
            arrow.style.top = '5px';
            arrow.style.left = '5px';
        } else {
            arrow.style.transform = 'rotate(0deg)';
            arrow.style.position = 'static';
        }
    });
}

let selectedCompareProducts = [];
let selectedCompareName = [];
let modalShown = false;

function handleComparison(id, name, image) {
    if (selectedCompareProducts.includes(id)) {
        // If already selected, unselect it by calling deleteBoxElement
        let compareInput = document.querySelector(`#product_${id}`);
        compareInput.checked = false;
        deleteBoxElement({ target: compareInput }, id, name);
        return;
    }

    if (selectedCompareProducts.length >= 4) {
        // Show modal if attempting to select 5th product
        document.getElementById('modal').style.display = 'block';

        var lottieContainer = document.getElementById('lottie-container');
        document.getElementById('close-modal').style.display = 'block';

        lottie.loadAnimation({
            container: lottieContainer,
            path: 'assets/animations/compare.json',
            renderer: 'svg',
            loop: true,
            autoplay: true,
            name: "Comparison Animation",
        });

        // Deselect checkbox since adding is blocked
        let compareInput = document.querySelector(`#product_${id}`);
        compareInput.checked = false;
        return;
    }

    selectedCompareProducts.push(id);
    let elementTitle = name;
    let elementImage = image;
    selectedCompareName.push(elementTitle);
    let comparisonContainer = document.getElementById('comparison-container');
    comparisonContainer.style.display = 'flex';
    let boxContainer = document.querySelectorAll('#comparison-box');

    for (let i = 0; i < boxContainer.length; i++) {
        if (boxContainer[i].innerHTML === '') {
            boxContainer[i].innerHTML = `<div class="box-cross-container">
                <img src="assets/images/box-cross.svg" alt="box-cross" style="cursor:pointer" onclick="deleteBoxElement(event,${id},'${elementTitle}')">
            </div>
            <div class="box-image-container">
                <img src=${elementImage} alt="comparison-image" style="width:110px;height: 110px;">
            </div>
            <div class="box-title-container">${elementTitle}</div>`;
            break;
        }
    }

    let elementCount = 0;
    boxContainer.forEach((box) => {
        if (box.innerHTML !== '') {
            elementCount += 1;
        }
    });

    document.getElementById('comparison-button').innerHTML = `Compare (${elementCount})`;
}

function deleteBoxElement(event, id, title) {
    let boxContainer = document.querySelectorAll('#comparison-box');
    event.target.parentElement.parentElement.innerHTML = ``;
    let elementCount = 0;
    boxContainer.forEach((box, index) => {
        if (box.innerHTML !== '') {
            elementCount += 1;
        }
    });
    if (elementCount === 0) {
        let comparisonContainer = document.getElementById('comparison-container');
        comparisonContainer.style.display = 'none';
    }
document.getElementById('comparison-button').innerHTML = `Compare (${elementCount})`;
    let index = selectedCompareProducts.indexOf(id);
    selectedCompareProducts.splice(index, 1);
    let nameIndex = selectedCompareName.indexOf(title);
    selectedCompareName.splice(nameIndex, 1);
    let compareInput = document.querySelector(`#product_${id}`);
    compareInput.checked = false;
    compareInput.disabled = false;
}

function handleComparisonToggle(element, id, name, image) {
    if (element.checked) {
        handleComparison(id, name, image);
    } else {
        removeComparison(id, name);
    }
}

function removeComparison(id, title) {
    let boxContainer = document.querySelectorAll('#comparison-box');
    boxContainer.forEach((box) => {
        if (box.innerHTML.includes(`deleteBoxElement(event,${id},'${title}')`)) {
            box.innerHTML = ``;
        }
    });

    let elementCount = 0;
    boxContainer.forEach((box) => {
        if (box.innerHTML !== '') {
            elementCount += 1;
        }
    });

    if (elementCount === 0) {
        document.getElementById('comparison-container').style.display = 'none';
    }

    document.getElementById('comparison-button').innerHTML = `Compare (${elementCount})`;

    let index = selectedCompareProducts.indexOf(id);
    if (index !== -1) selectedCompareProducts.splice(index, 1);

    let nameIndex = selectedCompareName.indexOf(title);
    if (nameIndex !== -1) selectedCompareName.splice(nameIndex, 1);

    let compareInput = document.querySelector(`#product_${id}`);
    if (compareInput) compareInput.disabled = false;
}

function handleClearComparison() {
    let comparisonContainer = document.getElementById('comparison-container');
    comparisonContainer.style.display = 'none';
    let boxContainer = document.querySelectorAll('#comparison-box');
    boxContainer.forEach(box => box.innerHTML = '');
    selectedCompareProducts = [];
    selectedCompareName = [];
    let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(function (checkbox) {
        checkbox.disabled = false;
        checkbox.checked = false;
    });
}

function handleCompareClick() {
    fetch(`${baseUrl}/increment-compare-count`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        product_ids: selectedCompareProducts
    })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = `/comparison.html?compare=${selectedCompareName}&${selectedCompareProducts}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function desktopProductCard(product, cardsContainer, show_offer = false, show_specs = false, show_compare_box = false) {
    let productCardHTML = `<div class="d-flex" style="justify-content: space-between;">
        <div class="left-aligned">
            <div class="product-offer">${product.discount_upto}%</div>
            <div class="product-stock">${product.is_in_stock === 1 ? 'In Stock' : 'Out Of Stock'}</div>
        </div>
        <div class="right-aligned">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <div class="total-rating">(24)</div>
        </div>
    </div>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            ${product.product_images.map(image => `
                        <div class="swiper-slide">
                            <img class="swiper-slide-image" src="${image}">
                        </div>
                    `).join('')}
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"><i class="fas fa-chevron-left"></i></div>
        <div class="swiper-button-next"><i class="fas fa-chevron-right"></i></div>
    </div>
    <div class="exchange-bonus">
        ${product?.exchange_bonus_text == null ? 'No Offers': product?.exchange_bonus_text}
    </div>
    <div class="product-title">${product.product_name}</div>
    <div class="product-description">${product.product_description.slice(0, 90).concat('...')}</div>
    
    ${show_offer && product.product_offers ? `<div class="offer-options">
        ${product.product_offers.map(text => `
                        <div class="offer-wrapper"><span><img style="position:relative;top: 3px;"
                    src="assets/images/green-tick.svg" alt="green-tick"></span><span class="offer-text">${text}</span></div>
                    `).join('')}
    </div>` : ``}

    ${show_specs ? `<div class="specs-images-container">
        ${product.product_specs_images.map(image => `
            <img src="${image}" alt="specs">
        `).join('')}
    </div>
    <div id="specs-section">
        <ul id="specs-list" class="specs-list" style="height: 0px;">
            ${product.operating_system_name? `<li>${product.operating_system_name}</li>` : ``}
            ${product.displays_type ? `<li>${product.displays_type}</li>` : ``}
            ${product.processor_name ? `<li>${product.processor_name}</li>` : `` }
            ${product.graphics_name ? `<li>${product.graphics_name}</li>` : ``}
        </ul>
    </div>` : ``}
    
    <div class="price-container">
        <span class="offer-price">${formatPriceInINR(product.product_discounted_price)}*  <span class="real-price">${formatPriceInINR(product.product_main_price)}</span></span>
       
        <span class="saved-price">Save ${formatPriceInINR(product.product_offer_value)}</span>
    </div>
    <div class="final-card-section">
        ${show_compare_box ? `<div class="left-aligned"> 
        <input 
        class="compare-checkbox" 
        type="checkbox" 
        id="product_${product.id}" 
        name="product" 
        value="${product.id}" 
        onchange="handleComparisonToggle(this, ${product.id}, '${product.product_name}', '${product.product_images[0]}')">
       
            <label for="product_${product.id}" class="compare-text" >Compare Product</label>
        </div>` : `<div class="left-aligned" onclick="handleSection(${product.id})">
            <span id="see-more-text_${product.id}" class="see-more-text">See More</span><span>
            <img style="padding-left: 3px; padding-top: 0px;cursor:pointer" src="assets/images/chevron-down.svg" alt="down" id="arrow-down_${product.id}">
            </span>
        </div>`}
        <div class="right-aligned"><button class="buy-now-button" onclick="handleRoute('${product.buy_now_url}')">Buy Now</button></div>
    </div>`;

    // Create a temporary container element to hold the HTML
    var tempContainer = document.createElement('div');
    tempContainer.classList.add('product-card');
    tempContainer.innerHTML = productCardHTML;

    // Append the first child (the product card) to the main container
    cardsContainer.appendChild(tempContainer);
}

function mobileProductCard(product, cardsContainer, show_offer = false, show_specs = false, show_compare_box = false) {
    var productCardHTML = `<div class="d-flex" style="justify-content: space-between;">
        <div class="left-aligned">
            <div class="product-offer">${product.discount_upto}%</div>
            <div class="product-stock">${product.is_in_stock === 1 ? 'In Stock' : 'Out Of Stock'}</div>
        </div>
        <div class="right-aligned">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <img src="assets/images/product/star.svg" alt="star" class="star-class">
            <div class="total-rating">(24)</div>
        </div>
    </div>
    <div class="card-elements-container">
        <div class="non-variant-image-container" id="non-variant-image-container">
            <img src="${product.product_images[0]}" alt="product" class="product-image">
        </div>
        <div class="card-content-container">
            <div class="product-title">${product.product_name}</div>
            <div class="product-description" id="product-description">${product.product_description.slice(0, 90).concat('...')}</div>
            
            ${show_offer && product.product_offers ? `<div class="offer-options">
                    ${product.product_offers.map(text => `
                        <div class="offer-wrapper"><span><img style="position:relative;top: 3px;"
                    src="assets/images/green-tick.svg" alt="green-tick"></span><span class="offer-text">${text}</span></div>
                    `).join('')}
            </div>` : ``}

            ${show_specs ? `<div class="specs-images-container">${product.product_specs_images.map(image => `
                    <img src="${image}" alt="specs">
            `).join('')}</div>` : ``}
        </div>

    </div>
    <div class="price-container">
        ${show_compare_box ? `<div class="left-aligned">
        <input 
        class="compare-checkbox" 
        type="checkbox" 
        id="product_${product.id}" 
        name="product" 
        value="${product.id}" 
        onchange="handleComparisonToggle(this, ${product.id}, '${product.product_name}', '${product.product_images[0]}')">
       
            <label for="product_${product.id}" class="compare-text" >Compare Product</label>
        </div>` : `<span class="offer-price">${formatPriceInINR(product.product_discounted_price)}*</span>
        <span class="real-price">${formatPriceInINR(product.product_main_price)}</span>
        <span class="saved-price">Save ${formatPriceInINR(product.product_offer_value)}</span>`}
        <div class="right-aligned"><button class="buy-now-button" onclick="handleRoute('${product.buy_now_url}')">Buy Now</button></div>
    </div>`;

    // Create a temporary container element to hold the HTML
    var tempContainer = document.createElement('div');
    tempContainer.classList.add('product-card');
    tempContainer.innerHTML = productCardHTML;

    // Append the first child (the product card) to the main container
    cardsContainer.appendChild(tempContainer);
}

document.querySelectorAll('#sort-by-mobile-container .sort-title').forEach(item => {
    item.addEventListener('click', () => {
      document.getElementById('sort-by-mobile-container').style.display = 'none';
    });
});  

document.querySelectorAll('#sort-by-mobile-container .sort-title').forEach(item => {
    item.addEventListener('click', () => {
        document.getElementById('sort-by-mobile-container').style.display = 'none';
    });
});

document.querySelectorAll('#category-menu option').forEach(option => {
    option.addEventListener('click', () => {
        document.getElementById('category-menu')?.classList.remove('menu-open');
    });
});