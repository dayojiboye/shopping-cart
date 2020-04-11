const mobileToggleElement = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mHasDropDownElement = document.querySelector('.m-has-dropdown');
const mobileDropdownMenuElement = document.querySelector(
  '.mobile-dropdown-menu'
);
const body = document.querySelector('body');
const mobileHasDropdown = document.querySelector('.mobile-has-dropdown');
const mobileCartMenu = document.querySelector('.mobile-cart-menu');
const alertBox = document.querySelector('.alert-box');
const itemName = document.getElementById('name');
const itemImage = document.getElementById('upload');
const itemDesc = document.getElementById('desc');
const itemPrice = document.getElementById('price');
const addBtn = document.getElementById('add-btn');
const prodContainer = document.querySelector('.products-container');
const mobileCartContainer = document.querySelector('.mobile-cart-container');
const cartContainer = document.querySelector('.cart-container');
const cartBadge = document.querySelectorAll('.cart-badge');
const totalPrice = document.querySelectorAll('.total__price');
const checkOutButtons = document.querySelectorAll('.check-out-btn');

const items = [];

const mobileMenuHandler = () => {
  mobileToggleElement.classList.toggle('change');
  mobileMenu.classList.toggle('visible');
  body.classList.toggle('fixed');
};

const mobileDropdownMenuHandler = () => {
  mobileDropdownMenuElement.classList.toggle('visible');
};

const mobileCartMenuHandler = () => {
  mobileCartMenu.classList.toggle('visible');
};

class Components {
  constructor(name, image, desc, price, addBtn, alertBox) {
    this.name = name;
    this.image = image;
    this.desc = desc;
    this.price = price;
    this.addBtn = addBtn;
    this.alertBox = alertBox;
  }

  hideAlertBoxHandler() {
    setTimeout(() => {
      this.alertBox.classList.remove('visible');
    }, 2000);
  }
}

class UpdateBadgeCount {
  constructor() {}

  static render() {
    for (const badge of cartBadge) {
      badge.textContent = items.length;
    }
  }
}

class UpdateTotalPrice {
  constructor() {}

  static render() {
    for (const tPrice of totalPrice) {
      const totPrice = items.reduce(
        (prevValue, curValue) =>
          (prevValue += parseInt(curValue.price.replace(/,/g, ''), 10)),
        0
      );
      tPrice.textContent =
        '$' + totPrice.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
  }
}

class AddToCart {
  constructor(image, name, price) {
    this.image = image;
    this.name = name;
    this.price = price;
  }

  render(x) {
    items.push(x);

    let products = document.querySelectorAll('.cart-prod');

    for (const product of products) {
      product.remove();
    }

    for (const prod of items) {
      const cartProd = document.createElement('div');
      cartProd.className = 'cart-prod';
      cartProd.innerHTML = `<img src="${prod.image}" alt="${prod.name}" />
        <div class="cart-details">
        <h5>${prod.name}</h5>
        <p>$${prod.price}</p>
      </div>`;

      const mobileCartProd = cartProd.cloneNode(true);
      const mainCartProd = cartProd.cloneNode(true);

      cartContainer.prepend(mainCartProd);
      mobileCartContainer.prepend(mobileCartProd);
    }

    UpdateBadgeCount.render();
    UpdateTotalPrice.render();
  }
}

class AddItem extends Components {
  constructor(name, image, desc, price, addBtn, alertBox) {
    super(name, image, desc, price, addBtn, alertBox);
  }

  clearInput() {
    this.name.value = '';
    this.image.value = '';
    this.desc.value = '';
    this.price.value = '';
  }

  getFormattedPrice() {
    const getPrice = parseInt(this.price.value);
    return getPrice.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  addItemHandler(tag, csName) {
    if (
      this.name.value.trim() === '' ||
      this.image.value.trim() === '' ||
      this.desc.value.trim() === '' ||
      this.price.value === ''
    ) {
      this.alertBox.classList.add('visible');
      this.hideAlertBoxHandler();
      return;
    }

    const card = document.createElement(tag);
    card.className = `${csName}`;
    card.innerHTML = `<img src="${this.image.value.trim()}" alt="${this.desc.value.trim()}" >
    <h3>${this.name.value.trim().toUpperCase()}</h3>
    <p class="prod-desc">${this.desc.value.trim()}</p>
    <p>$<span class="price">${this.getFormattedPrice()}</span></p>
    <div class="card-footer">
      <div class="ratings">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
      </div>
      <button type="button" class="add-to-cart">ADD TO CART</button>
    </div>`;

    const appendCard = prodContainer.append(card);
    this.clearInput();

    const prodName = card.querySelector('h3');
    const prodImage = card.querySelector('img');
    const prodPrice = card.querySelector('.price');

    const prodObj = new AddToCart(
      prodImage.src,
      prodName.textContent,
      prodPrice.textContent
    );

    const addToCartBtn = card.querySelector('.add-to-cart');

    addToCartBtn.addEventListener('click', prodObj.render.bind(this, prodObj));

    return appendCard;
  }

  getItemHandler() {
    this.addBtn.addEventListener(
      'click',
      this.addItemHandler.bind(this, 'div', 'card')
    );
  }
}

class CheckOut {
  constructor() {}

  render() {
    items.length = 0;
    UpdateBadgeCount.render();
    UpdateTotalPrice.render();

    let products = document.querySelectorAll('.cart-prod');

    for (const product of products) {
      product.remove();
    }
  }
}

const checkOutHandler = new CheckOut();

for (const btn of checkOutButtons) {
  btn.addEventListener('click', checkOutHandler.render);
}

const getItemObj = new AddItem(
  itemName,
  itemImage,
  itemDesc,
  itemPrice,
  addBtn,
  alertBox
);

getItemObj.getItemHandler();

mobileToggleElement.addEventListener('click', mobileMenuHandler);
mHasDropDownElement.addEventListener('click', mobileDropdownMenuHandler);
mobileHasDropdown.addEventListener('click', mobileCartMenuHandler);
