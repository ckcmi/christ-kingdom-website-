/* =====================================================
   CHRIST KINGDOM CHRISTIAN MISSION INTERNATIONAL
   JAVASCRIPT
   Replace your whole script.js with this file.
===================================================== */


/* =====================================================
   EDIT THESE (the only parts you need to change)
===================================================== */

/* 1. UPCOMING EVENTS
   Add one line for each event. The date must be written as YEAR-MONTH-DAY.
   Events whose date has passed are hidden automatically, so you never have
   to delete old ones. If there are no upcoming events, visitors see a friendly
   "join us on Sunday" message instead.

   Fields:  date (required), title (required), text, time, place, link
*/
const EVENTS = [
    {
        date: "2026-11-08",
        title: "Annual Fundraising",
        text: "“Give, and it will be given to you.” Luke 6:38",
        time: "",
        place: ""
    }

    /* Example of a new event (remove the slashes and edit it):
    ,{
        date: "2026-12-20",
        title: "Carol Service",
        text: "An evening of worship and Christmas carols for the whole family.",
        time: "5:00 PM",
        place: "Oshiyie"
    }
    */
];

/* 2. CONTACT FORM
   Option A (works right now): leave FORM_ENDPOINT empty. When someone sends the
   form, WhatsApp opens with their message ready to send to the church number.

   Option B (messages arrive by email): create a free form at formspree.io,
   then paste its link here, for example "https://formspree.io/f/abcdwxyz".
*/
const FORM_ENDPOINT = "";

const WHATSAPP_NUMBER = "233594082866";



/* ================= HERO SLIDER ================= */

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".slider-dot");

let currentSlide = 0;
let slideTimer = null;


function showSlide(index) {

    if (!slides.length) return;

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");

    currentSlide = index;
}


function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}


function startSlider() {
    clearInterval(slideTimer);
    if (slides.length > 1) {
        slideTimer = setInterval(nextSlide, 6000);
    }
}


dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {
        showSlide(index);
        startSlider();
    });

});

startSlider();


/* ================= MOBILE MENU ================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");


function setMenu(open) {

    if (!menuButton || !mobileMenu) return;

    mobileMenu.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}


if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {
        setMenu(!mobileMenu.classList.contains("active"));
    });

    /* close after tapping a link */
    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    /* close when tapping outside the menu, or pressing Escape */
    document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
            setMenu(false);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) setMenu(false);
    });
}


/* ================= NAVBAR: SCROLL EFFECT + ACTIVE LINK ================= */

const navbar = document.getElementById("navbar");

function updateNavbar() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();


const navLinks = document.querySelectorAll(".nav-links a");
const watchedSections = ["home", "about", "services", "events", "gallery", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

if ("IntersectionObserver" in window && watchedSections.length) {

    const spy = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });

        });

    }, { rootMargin: "-45% 0px -50% 0px" });

    watchedSections.forEach((section) => spy.observe(section));
}


/* ================= UPCOMING EVENTS ================= */

const eventsGrid = document.getElementById("eventsGrid");

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

function parseDate(value) {
    const parts = String(value).split("-").map(Number);
    return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
}

function renderEvents() {

    if (!eventsGrid) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = EVENTS
        .filter((event) => event.date && event.title)
        .map((event) => ({ ...event, when: parseDate(event.date) }))
        .filter((event) => !isNaN(event.when) && event.when >= today)
        .sort((a, b) => a.when - b.when);

    if (!upcoming.length) {

        eventsGrid.innerHTML = `
            <div class="events-empty reveal">
                <div class="empty-icon"><svg class="ic"><use href="#i-calendar"/></svg></div>
                <h3>Join us every Sunday</h3>
                <p>
                    There are no special events scheduled right now.
                    Our doors are always open: come and worship with us
                    on Sundays from 8:00 AM to 11:00 AM.
                </p>
                <a href="#visit" class="btn primary">PLAN YOUR VISIT</a>
            </div>`;

        observeReveal(eventsGrid.querySelectorAll(".reveal"));
        return;
    }

    eventsGrid.innerHTML = upcoming.map((event) => {

        const day = String(event.when.getDate()).padStart(2, "0");
        const month = event.when
            .toLocaleDateString("en-GB", { month: "short" })
            .toUpperCase();

        const longDate = event.when.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const details = [longDate, event.time, event.place]
            .filter(Boolean)
            .join(" · ");

        const link = event.link || "#contact";

        return `
            <div class="event-card reveal">
                <div class="event-date">
                    <strong>${day}</strong>
                    <span>${month}</span>
                </div>
                <div class="event-info">
                    <h3>${escapeHtml(event.title)}</h3>
                    <span class="event-when">${escapeHtml(details)}</span>
                    ${event.text ? `<p>${escapeHtml(event.text)}</p>` : ""}
                    <a href="${escapeHtml(link)}">MORE INFORMATION <svg class="ic"><use href="#i-arrow"/></svg></a>
                </div>
            </div>`;
    }).join("");

    observeReveal(eventsGrid.querySelectorAll(".reveal"));
}


/* ================= SCROLL REVEAL ================= */

let revealObserver = null;

if ("IntersectionObserver" in window) {

    revealObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.12 });
}

function observeReveal(elements) {

    elements.forEach((element) => {

        if (revealObserver) {
            revealObserver.observe(element);
        } else {
            element.classList.add("show");
        }

    });
}

renderEvents();
observeReveal(document.querySelectorAll(".reveal"));


/* ================= PHOTO VIEWER (GALLERY) ================= */

const lightbox = document.getElementById("lightbox");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

if (lightbox && galleryItems.length) {

    const lightboxImg = lightbox.querySelector("img");
    let photoIndex = 0;

    function showPhoto(index) {

        photoIndex = (index + galleryItems.length) % galleryItems.length;

        const source = galleryItems[photoIndex].querySelector("img");
        lightboxImg.src = source.currentSrc || source.src;
        lightboxImg.alt = source.alt;
    }

    function openViewer(index) {
        showPhoto(index);
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeViewer() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => openViewer(index));
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeViewer);
    lightbox.querySelector(".prev").addEventListener("click", (e) => { e.stopPropagation(); showPhoto(photoIndex - 1); });
    lightbox.querySelector(".next").addEventListener("click", (e) => { e.stopPropagation(); showPhoto(photoIndex + 1); });

    /* tapping the dark area closes the viewer */
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeViewer();
    });

    document.addEventListener("keydown", (e) => {

        if (!lightbox.classList.contains("open")) return;

        if (e.key === "Escape") closeViewer();
        if (e.key === "ArrowLeft") showPhoto(photoIndex - 1);
        if (e.key === "ArrowRight") showPhoto(photoIndex + 1);
    });
}


/* ================= CONTACT FORM ================= */

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

function setNote(message, type) {
    if (!formNote) return;
    formNote.textContent = message;
    formNote.className = "form-note" + (type ? " " + type : "");
}

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        /* spam trap: bots fill this hidden field, people never do */
        if (contactForm.elements["_gotcha"] && contactForm.elements["_gotcha"].value) return;

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const data = new FormData(contactForm);
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const subject = String(data.get("subject") || "").trim();
        const message = String(data.get("message") || "").trim();

        /* Option A: no Formspree link yet, so send through WhatsApp */
        if (!FORM_ENDPOINT) {

            const text =
                "Hello, my name is " + name + ".\n" +
                (subject ? "Subject: " + subject + "\n" : "") +
                "\n" + message + "\n\n" +
                "My email: " + email;

            window.open(
                "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text),
                "_blank",
                "noopener"
            );

            setNote("Opening WhatsApp so you can send your message. Thank you!", "success");
            contactForm.reset();
            return;
        }

        /* Option B: send to the church email through Formspree */
        const button = contactForm.querySelector("button[type='submit']");
        const originalHtml = button.innerHTML;

        button.disabled = true;
        button.textContent = "SENDING...";
        setNote("", "");

        try {

            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                body: data,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) throw new Error("Request failed");

            setNote(
                "Thank you for contacting Christ Kingdom Christian Mission International. We will get back to you soon.",
                "success"
            );
            contactForm.reset();

        } catch (error) {

            setNote(
                "Sorry, your message could not be sent. Please call or WhatsApp us on +233 59 408 2866.",
                "error"
            );

        } finally {

            button.disabled = false;
            button.innerHTML = originalHtml;
        }

    });
}


/* ================= FOOTER YEAR ================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}s
