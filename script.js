  //  SETTINGS  
const SETTINGS = {
  mapsUrl: "https://www.google.com/maps",  
  whatsapp: "9336892258",                
  deliveryFee: 49,                        
  freeDeliveryOver: 599                    
};

/*  DATA */
const MENU = [
  { category: "Starters", name: "Paneer Tikka", description: "Charred cottage cheese in spiced yogurt marinade", price: 249, veg: true, image: "images/paneer-tikka.jpg" },
  { category: "Starters", name: "Crispy Corn", description: "Golden corn kernels tossed with pepper and herbs", price: 179, veg: true, image: "images/crispy-corn.jpg" },
  { category: "Starters", name: "Chicken Tikka", description: "Tandoor-roasted chicken with mint chutney", price: 299, veg: false, image: "images/chicken-tikka.jpg" },
  { category: "Starters", name: "Veg Spring Rolls", description: "Crisp rolls stuffed with garden vegetables", price: 189, veg: true, image: "images/veg-spring-rolls.jpg" },

  { category: "Main Course", name: "Paneer Butter Masala", description: "Paneer in a silky tomato-butter gravy", price: 289, veg: true, image: "images/paneer-butter-masala.jpg" },
  { category: "Main Course", name: "Dal Makhani", description: "Black lentils slow-cooked overnight with cream", price: 249, veg: true, image: "images/dal-makhani.jpg" },
  { category: "Main Course", name: "Butter Chicken", description: "Tender chicken in a rich, mildly sweet makhani sauce", price: 349, veg: false, image: "images/butter-chicken.jpg" },
  { category: "Main Course", name: "Chicken Biryani", description: "Fragrant basmati layered with marinated chicken", price: 299, veg: false, image: "images/chicken-biryani.jpg" },
  { category: "Main Course", name: "Veg Biryani", description: "Saffron rice with seasonal vegetables and raita", price: 249, veg: true, image: "images/veg-biryani.jpg" },
  { category: "Main Course", name: "Shahi Paneer", description: "Royal gravy of cashew, cream and mild spices", price: 299, veg: true, image: "images/shahi-paneer.jpg" },

  { category: "Italian & Chinese", name: "White Sauce Pasta", description: "Penne in creamy béchamel with herbs", price: 269, veg: true, image: "images/white-sauce-pasta.jpg" },
  { category: "Italian & Chinese", name: "Veg Hakka Noodles", description: "Wok-tossed noodles with crunchy vegetables", price: 199, veg: true, image: "images/veg-hakka-noodles.jpg" },
  { category: "Italian & Chinese", name: "Margherita Pizza", description: "Stone-baked, fresh mozzarella and basil", price: 299, veg: true, image: "images/margherita-pizza.jpg" },

  { category: "Desserts", name: "Chocolate Brownie", description: "Warm fudge brownie with chocolate drizzle", price: 149, veg: true, image: "images/chocolate-brownie.jpg" },
  { category: "Desserts", name: "Gulab Jamun", description: "Soft milk dumplings in cardamom syrup", price: 99, veg: true, image: "images/gulab-jamun.jpg" }
];

// filter buttons 
const CATEGORIES = ["All", "Starters", "Main Course", "Italian & Chinese", "Desserts"];

// Sample guest reviews
const REVIEWS = [
  { name: "Aarav M.", rating: 5, text: "Dal Makhani that tastes like it simmered all night, and service that never felt rushed." },
  { name: "Neha S.", rating: 5, text: "We booked for a family dinner and the staff handled everything quietly. The biryani was excellent." },
  { name: "Rohan K.", rating: 4, text: "Great variety. The pasta and the paneer tikka were both properly made, not an afterthought." },
  { name: "Ishita P.", rating: 5, text: "Lovely ambience for an anniversary. The gulab jamun was the perfect finish." }
];

// Gallery photos
const GALLERY = [
  { title: "Dining room", image: "images/about-dining-room.jpg" },
  { title: "Entrance", image: "images/gallery-entrance.jpg" },
  { title: "Signature dish", image: "images/gallery-signature-dish.jpg" },
  { title: "Preparing food", image: "images/gallery-kitchen.jpg" },
  { title: "Desserts", image: "images/gallery-dessert.jpg" }
];


/*HELPER TOOLS */

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function escapeHTML(text) {
  const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text).replace(/[&<>"']/g, (character) => replacements[character]);
}

function loadSaved(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

function isValidPhone(value) {
  // Accepts 10 digits
  const digits = value.replace(/[\s-]/g, "").replace(/^\+?91/, "");
  return /^\d{10}$/.test(digits);
}

function showFieldError(form, fieldName, message) {
  const field = form.elements[fieldName];
  field.parentNode.querySelector(".error-msg").textContent = message || "";
  return !message;
}

$$("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

$$("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});


/*  MENU */
let selectedCategory = "All";

function renderMenu() {
  $("#category-filters").innerHTML = CATEGORIES.map((category) => `
    <button class="${category === selectedCategory ? "active" : ""}"
            data-category="${category}"
            aria-pressed="${category === selectedCategory}">
      ${category}
    </button>
  `).join("");
  
  $("#menu-grid").innerHTML = MENU.map((dish, index) => {
    const isShown = selectedCategory === "All" || dish.category === selectedCategory;
    if (!isShown) return "";

    return `
      <article class="dish-card">
        <div class="dish-photo">
          <img src="${dish.image}" alt="${dish.name}" width="480" height="330">
          <i class="diet-mark ${dish.veg ? "veg" : "nonveg"}"
             title="${dish.veg ? "Vegetarian" : "Non-vegetarian"}"></i>
        </div>
        <div class="dish-info">
          <h3>${dish.name}</h3>
          <p>${dish.description}</p>
          <div class="dish-row">
            <b>${formatPrice(dish.price)}</b>
            <div class="qty">
              <button data-step="-1" aria-label="Decrease quantity">−</button>
              <output>1</output>
              <button data-step="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="btn btn-full" data-add="${index}">Add to Cart</button>
        </div>
      </article>
    `;
  }).join("");
}

// Clicking a category button
$("#category-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderMenu();
});

// Footer menu
document.addEventListener("click", (event) => {
  const link = event.target.closest("footer [data-category]");
  if (!link) return;
  selectedCategory = link.dataset.category;
  renderMenu();
});

$("#menu-grid").addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-step]");
  if (stepButton) {
    const output = stepButton.parentNode.querySelector("output");
    const newValue = Number(output.textContent) + Number(stepButton.dataset.step);
    output.textContent = Math.min(20, Math.max(1, newValue));
    return;
  }

  // Add to cart
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const dishIndex = addButton.dataset.add;
    const quantity = Number(addButton.closest(".dish-card").querySelector("output").textContent);

    cart[dishIndex] = (cart[dishIndex] || 0) + quantity;
    saveCart();
    addButton.textContent = "Added ✓";
    setTimeout(() => { addButton.textContent = "Add to Cart"; }, 900);
  }
});

let cart = loadSaved("rp_cart", {});
Object.keys(cart).forEach((key) => {
  if (!MENU[key] || !(cart[key] > 0)) delete cart[key];
});
function getTotals() {
  let subtotal = 0;
  let itemCount = 0;

  for (const index in cart) {
    subtotal += MENU[index].price * cart[index];
    itemCount += cart[index];
  }

  const delivery = subtotal > 0 && subtotal < SETTINGS.freeDeliveryOver ? SETTINGS.deliveryFee : 0;
  return { subtotal, itemCount, delivery, total: subtotal + delivery };
}

function totalsHTML(totals) {
  const deliveryLabel = totals.subtotal > 0 && totals.delivery === 0 ? "Delivery (free)" : "Delivery";
  const freeDeliveryHint = totals.subtotal > 0 && totals.delivery > 0
    ? `<small class="note">Free delivery over ${formatPrice(SETTINGS.freeDeliveryOver)}</small>`
    : "";

  return `
    <div><span>Subtotal</span><span>${formatPrice(totals.subtotal)}</span></div>
    <div><span>${deliveryLabel}</span><span>${formatPrice(totals.delivery)}</span></div>
    <div class="grand"><span>Total</span><span>${formatPrice(totals.total)}</span></div>
    ${freeDeliveryHint}
  `;
}

function saveCart() {
  save("rp_cart", cart);
  renderCart();
}

function renderCart() {
  const totals = getTotals();
  $("#cart-count").textContent = totals.itemCount;

  const indexes = Object.keys(cart);

  if (indexes.length === 0) {
    $("#cart-items").innerHTML = '<p class="empty-cart">Your cart is empty. Add a dish from the menu.</p>';
  } else {
    $("#cart-items").innerHTML = indexes.map((index) => {
      const dish = MENU[index];
      return `
        <li>
          <img class="thumb" src="${dish.image}" alt="">
          <div>
            <b>${dish.name}</b>
            <small>${formatPrice(dish.price)} each</small>
          </div>
          <div class="qty">
            <button data-index="${index}" data-step="-1" aria-label="Decrease">−</button>
            <output>${cart[index]}</output>
            <button data-index="${index}" data-step="1" aria-label="Increase">+</button>
          </div>
          <button class="remove-btn" data-remove="${index}" aria-label="Remove ${dish.name}">✕</button>
        </li>
      `;
    }).join("");
  }

  $("#cart-totals").innerHTML = totalsHTML(totals);
  $("#checkout-btn").disabled = totals.itemCount === 0;
}

$("#cart-items").addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-index]");
  const removeButton = event.target.closest("[data-remove]");

  if (stepButton) {
    const index = stepButton.dataset.index;
    cart[index] += Number(stepButton.dataset.step);
    if (cart[index] < 1) delete cart[index];   
    saveCart();
  }

  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveCart();
  }
});

$("#open-cart").addEventListener("click", () => $("#cart-drawer").showModal());

$("#checkout-btn").addEventListener("click", () => {
  $("#cart-drawer").close();

  $("#checkout-body").innerHTML = `
    <div class="totals">${totalsHTML(getTotals())}</div>

    <form id="order-form" novalidate>
      <label>Full name
        <input name="name">
        <span class="error-msg"></span>
      </label>
      <label>Phone number
        <input name="phone" type="tel" inputmode="numeric">
        <span class="error-msg"></span>
      </label>
      <label>Delivery address
        <textarea name="address" rows="3"></textarea>
        <span class="error-msg"></span>
      </label>
      <label>Instructions (optional)
        <textarea name="instructions" rows="2"></textarea>
      </label>

      <label>
        <span><input type="radio" checked disabled> Cash on Delivery</span>
        <small class="note">Online payment is not set up. Pay in cash when your order arrives.</small>
      </label>

      <div class="note">Your order is saved and a confirmation message will be sent by the restaurant.</div>
      <button class="btn btn-dark" type="submit">Place Order</button>
    </form>
  `;

  $("#checkout-dialog").showModal();
  $("#order-form").addEventListener("submit", placeOrder);
});

function placeOrder(event) {
  event.preventDefault();
  const form = event.target;
  const fields = form.elements;

  // Check every field 
  const nameOk = showFieldError(form, "name", fields.name.value.trim().length < 2 ? "Enter your name." : "");
  const phoneOk = showFieldError(form, "phone", !isValidPhone(fields.phone.value) ? "Enter a valid 10-digit phone number." : "");
  const addressOk = showFieldError(form, "address", fields.address.value.trim().length < 10 ? "Enter your full delivery address." : "");
  if (!(nameOk && phoneOk && addressOk)) return;

  // order record
  const totals = getTotals();
  const orderNumber = "RP" + Date.now().toString().slice(-7);

  const order = {
    number: orderNumber,
    name: fields.name.value.trim(),
    phone: fields.phone.value.trim(),
    address: fields.address.value.trim(),
    instructions: fields.instructions.value.trim(),
    items: Object.keys(cart).map((index) => ({
      name: MENU[index].name,
      quantity: cart[index],
      price: MENU[index].price
    })),
    total: totals.total,
    payment: "Cash on Delivery",
    placedAt: new Date().toISOString()
  };

  const wasSaved = save("rp_orders", [...loadSaved("rp_orders", []), order]);

  // Empty the cart
  cart = {};
  saveCart();

  // Show the confirmation
  $("#checkout-body").innerHTML = `
    <div class="success-box">
      <h3>Order recorded: ${orderNumber}</h3>
      <p>${wasSaved ? "Saved ." : "Could not save ."}
         The restaurant has received it, soon order will be confirmed.</p>
      <dl>
        <dt>Name</dt><dd>${escapeHTML(order.name)}</dd>
        <dt>Total</dt><dd>${formatPrice(order.total)}, Cash on Delivery</dd>
        <dt>Address</dt><dd>${escapeHTML(order.address)}</dd>
      </dl>
    </div>
    <p><a class="btn btn-dark" href="#menu" id="back-to-menu">Back to Menu</a></p>
  `;

  $("#back-to-menu").addEventListener("click", () => $("#checkout-dialog").close());
}


/*  TABLE RESERVATION  */
const reservationForm = $("#reservation-form");

(function setUpReservationForm() {
  let timeOptions = '<option value="">Select time</option>';

  for (let minutes = 11 * 60; minutes <= 22 * 60 + 30; minutes += 30) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60 === 0 ? "00" : "30";
    const hour12 = ((hour24 + 11) % 12) + 1;
    const period = hour24 < 12 ? "AM" : "PM";

    timeOptions += `<option value="${String(hour24).padStart(2, "0")}:${minute}">${hour12}:${minute} ${period}</option>`;
  }
  reservationForm.elements.time.innerHTML = timeOptions;

  let guestOptions = "";
  for (let guests = 1; guests <= 12; guests++) {
    guestOptions += `<option>${guests}</option>`;
  }
  reservationForm.elements.guests.innerHTML = guestOptions + "<option>13+ (call us)</option>";
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  reservationForm.elements.date.min = `${today.getFullYear()}-${month}-${day}`;
})();

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = reservationForm.elements;
  const now = new Date();
  const chosenMoment = fields.date.value && fields.time.value
    ? new Date(fields.date.value + "T" + fields.time.value)
    : null;
  const dateIsPast = fields.date.value && new Date(fields.date.value + "T23:59") < now;

  const checks = [
    showFieldError(reservationForm, "name", fields.name.value.trim().length < 2 ? "Enter your name." : ""),
    showFieldError(reservationForm, "phone", !isValidPhone(fields.phone.value) ? "Enter a valid 10-digit phone number." : ""),
    showFieldError(reservationForm, "email", !isValidEmail(fields.email.value) ? "Enter a valid email address." : ""),
    showFieldError(reservationForm, "date", !fields.date.value ? "Choose a date." : (dateIsPast ? "Date can’t be in the past." : "")),
    showFieldError(reservationForm, "time", !fields.time.value ? "Choose a time." : (chosenMoment && chosenMoment < now ? "Choose a time later than now." : ""))
  ];
  if (checks.includes(false)) return;

  const reservation = {
    id: "RPR-" + Date.now().toString(36).toUpperCase().slice(-6),
    name: fields.name.value.trim(),
    phone: fields.phone.value.trim(),
    email: fields.email.value.trim(),
    date: fields.date.value,
    time: fields.time.value,
    guests: fields.guests.value,
    requests: fields.requests.value.trim()
  };

  const wasSaved = save("rp_reservations", [...loadSaved("rp_reservations", []), reservation]);

  if (!wasSaved) {
    $("#reservation-result").innerHTML =
      '<p class="error-msg">We couldn’t save your request in this browser. Please call the restaurant instead.</p>';
    return;
  }
  // Show the details back to the visitor
  $("#reservation-result").innerHTML = `
    <div class="success-box" style="margin-top:16px" role="status">
      <h3>Request saved: ${reservation.id}</h3>
      <p>The restaurant has been notified, booking confirmation will be sent via mobile number.</p>
      <dl>
        <dt>Name</dt><dd>${escapeHTML(reservation.name)}</dd>
        <dt>Date</dt><dd>${reservation.date} at ${reservation.time}</dd>
        <dt>Guests</dt><dd>${escapeHTML(reservation.guests)}</dd>
        <dt>Phone</dt><dd>${escapeHTML(reservation.phone)}</dd>
        ${reservation.requests ? `<dt>Requests</dt><dd>${escapeHTML(reservation.requests)}</dd>` : ""}
      </dl>
    </div>
  `;

  reservationForm.reset();
});


/*CONTACT FORM, NEWSLETTER, WHATSAPP AND MAP LINKS*/
const contactForm = $("#contact-form");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = contactForm.elements;

  const checks = [
    showFieldError(contactForm, "name", !fields.name.value.trim() ? "Enter your name." : ""),
    showFieldError(contactForm, "email", !isValidEmail(fields.email.value) ? "Enter a valid email address." : ""),
    showFieldError(contactForm, "message", fields.message.value.trim().length < 5 ? "Write a short message." : "")
  ];
  if (checks.includes(false)) return;

  save("rp_messages", [...loadSaved("rp_messages", []), {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    message: fields.message.value.trim()
  }]);

  $("#contact-result").innerHTML =
    '<p class="success-box" role="status">Message saved. It has been sent to the restaurant.</p>';
  contactForm.reset();
});

$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.elements.email.value.trim();

  if (!isValidEmail(email)) {
    $("#newsletter-result").textContent = "Enter a valid email address.";
    return;
  }

  save("rp_newsletter", [...loadSaved("rp_newsletter", []), email]);
  $("#newsletter-result").textContent = "Saved";
  event.target.reset();
});

$("#whatsapp-btn").href =
  "https://wa.me/" + SETTINGS.whatsapp + "?text=" + encodeURIComponent("Hello Royal Plate, I’d like to ask about…");

$("#map-link").href = SETTINGS.mapsUrl;


/*  GALLERY AND PHOTO VIEWER */
$("#gallery-grid").innerHTML = GALLERY.map((photo, index) => `
  <button data-photo="${index}" aria-label="View ${photo.title}">
    <img src="${photo.image}" alt="" loading="lazy">
    <span>${photo.title}</span>
  </button>
`).join("");

$("#gallery-grid").addEventListener("click", (event) => {
  const tile = event.target.closest("[data-photo]");
  if (!tile) return;

  const photo = GALLERY[tile.dataset.photo];
  $("#lightbox-title").textContent = photo.title;
  $("#lightbox-image").innerHTML = `<img src="${photo.image}" alt="${photo.title}">`;
  $("#lightbox").showModal();
});

let currentReview = 0;
let reviewTimer;

function renderReview() {
  const review = REVIEWS[currentReview];

  $("#review").innerHTML = `
    <div class="avatar" aria-hidden="true">${review.name[0]}</div>
    <div class="stars" aria-label="${review.rating} out of 5 stars">
      ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
    </div>
    <p>“${review.text}”</p>
    <b>${review.name}</b>
  `;
}

function changeReview(direction) {
  currentReview = (currentReview + direction + REVIEWS.length) % REVIEWS.length;
  renderReview();

  clearInterval(reviewTimer);
  reviewTimer = setInterval(() => changeReview(1), 7000);
}

$("#review-prev").addEventListener("click", () => changeReview(-1));
$("#review-next").addEventListener("click", () => changeReview(1));


$("#burger").addEventListener("click", () => {
  const isOpen = $("#links").classList.toggle("open");
  $("#burger").setAttribute("aria-expanded", isOpen);
});

$("#links").addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    $("#links").classList.remove("open");
    $("#burger").setAttribute("aria-expanded", "false");
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach((element) => observer.observe(element));
} else {
  // Very old browsers: just show everything
  $$(".reveal").forEach((element) => element.classList.add("visible"));
}

renderMenu();
renderCart();
renderReview();
reviewTimer = setInterval(() => changeReview(1), 7000);
