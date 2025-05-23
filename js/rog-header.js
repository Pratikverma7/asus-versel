let screenWidth = screen.availWidth;
let baseUrl = 'https://asus-admin.3mindsdigital.com/api';

function handleSearchClick(){
    document.getElementById('main-links').style.display = 'none';
    if(screenWidth < 820){
        document.getElementById('list-container').style.display = 'block';
        document.getElementById('list-container').style.width = '100%';
        document.querySelector('.navbar-logo').style.display = 'none';
        document.querySelector('.temp-section').style.display = 'none';
    
    }
    let searchContainer = document.querySelector('.search-main-container');
    document.querySelector('.links-container').style.paddingTop = '0';
    document.querySelector('.compare-navbar-container').style.visibility = 'hidden';
    searchContainer.style.display = 'block';
    // setTimeout(()=>{
        document.querySelector('.main-search').focus();
    // },500)
    runSuggestionCode();
}
function handleSearchClose(){
    document.getElementById('main-links').style.display = 'block';
    if(screenWidth < 820){
        document.getElementById('list-container').style.display = 'none';
        document.querySelector('.navbar-logo').style.display = 'block';
        document.querySelector('.temp-section').style.display = 'block';
    }
    let searchContainer = document.querySelector('.search-main-container');
    document.querySelector('.links-container').style.paddingTop = '10px';
    document.querySelector('.compare-navbar-container').style.visibility = 'visible';
    searchContainer.style.display = 'none';
}
let productsArray = [];
let suggestions = [];

fetch(`${baseUrl}/products?is_rog=1`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
       productsArray = data.data;
       data.data.forEach(product=>{
        suggestions.push({
            name: product.product_name,
            series: product?.series_name,
            image: product.product_images[0],
            url: product.buy_now_url,
            processor:product?.processor_name
            // Add other fields as needed
        });
       })
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    function runSuggestionCode(){

        // getting all required elements
        const searchInput = document.querySelector(".searchInput");
        const mainSearchInput = document.querySelector(".main-search");
        const resultBox = document.querySelector(".resultBox");
        
        function debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        }
    
        const debouncedSearch = debounce((searchValue) => searchProducts(searchValue), 300);
    
        // if user press any key and release
        mainSearchInput.onkeyup = (e)=>{
            let searchValue = e.target.value;
            if(searchValue){
                searchInput.classList.add("active");
            }else{
                searchInput.classList.remove("active");
            }
            debouncedSearch(searchValue);
        }
        
        function searchProducts(searchValue){
            // Clear Previous Response
            resultBox.innerHTML = '';
    
            fetch(`${baseUrl}/products?is_rog=0&search=${searchValue}&limit=10`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const productHTML = data.data.map((product) => `
                        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e6e6e6">
                            <div style="width:10%" class="search-image-container">
                                <img src="${product.product_images[0]}" class="search-image" />
                            </div>
                            <div style="width:40%;justify-content:start;padding-top:20px;padding-left:20px" id="main-search-title">
                                 <div class="main-search-title">${product.product_name}</div>
                                <div class="main-search-processor">${product.processor_name}</div>
                            </div>
                            <div style="width:50%;justify-content:end;display:flex;padding-top:10px">
                                <span>
                                    <button class="buy-now-search" onclick="handleBuy('${product.buy_now_url}')">Buy Now</button>
                                </span>
                            </div>
                        </div>
                    `).join('');
    
                    resultBox.insertAdjacentHTML('beforeend', productHTML);
    
                    resultBox.querySelectorAll("li").forEach((listItem) => {
                        listItem.setAttribute("onclick", "handleSearchSelection(this)");
                    });
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        }
    
    
    
        document.addEventListener('click', function(event) {
            var navbar = document.getElementById('desktop-navbar');
            // Check if the clicked element is NOT inside the desktop-navbar
            if (!navbar.contains(event.target)) {
                // This block will run when user clicks outside the desktop-navbar
                // Call your function here
                handleSearchClose();
            }
        });
    
        var suggestedContents = document.querySelectorAll('.suggested-content');
    
        suggestedContents.forEach(function(content) {
            content.addEventListener('mouseover', function() {
                var title = this.querySelector('.suggested-title');
                var image = this.querySelector('div.trending-searches-container .suggested-image img');
                if (title) {
                    title.style.color = 'var(--primary-color)'; // Change to desired color
                }
                if(image){
                    image.style.filter = 'invert(33%) sepia(100%) saturate(2863%) hue-rotate(217deg) brightness(107%) contrast(108%)';
                }
            });
    
            content.addEventListener('mouseout', function() {
                var title = this.querySelector('.suggested-title');
                var image = this.querySelector('.suggested-image img');
                if (title) {
                    title.style.color = '#53565A'; // Reset to original color
                }
                if(image){
                    image.style.filter = 'none';
                }
            });
        });
    
    }

  // fetching all the series
  let seriesData;
  fetch(`${baseUrl}/series?is_rog=1`)
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
     seriesData = data.data;
     let linksContainer = document.getElementById('header-links-container');
     if(linksContainer){
        linksContainer.innerHTML = `${seriesData.map(series =>`<li class="link-class"><a href="rog-listing.html?series=${series.id}&${series.name}">${series.name}</a></li>`).join('')}`;
     }
     let mobileLinksContainer = document.getElementById('mobile-links-container');
     if(mobileLinksContainer){
        mobileLinksContainer.innerHTML = `${seriesData.map(series =>`<li class="mobile-links-class"><a href="rog-listing.html?series=${series.id}&${series.name}">${series.name}</a></li>`).join('')}`;
     }
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });

  function handleCompareRoute(){
    window.location.href = '/comparison.html';
  }

  function handleHamburger(){
    let menuContent = document.getElementById('menuContent');
    let menu = document.getElementById('hamburger');
    if(menuContent.style.display === 'none'){
        menuContent.style.display = 'block';
        menu.src = 'layout/assets/images/search-cancel.svg';
    }else{
        menuContent.style.display = 'none';
        menu.src = 'layout/assets/images/hamburger-icon.svg';
    }
  }