// ============================================
// KBR RESTRO & BAR - JavaScript Functionality
// ============================================

// ============================================
// Menu Search/Filter Feature
// ============================================
const menuSearch = document.getElementById('menuSearch');
const menuCards = document.querySelectorAll('.menu-card');

if (menuSearch) {
    menuSearch.addEventListener('keyup', function() {
        const searchValue = menuSearch.value.toLowerCase();
        
        menuCards.forEach(card => {
            const itemName = card.querySelector('h4').textContent.toLowerCase();
            const itemDesc = card.querySelector('.menu-description').textContent.toLowerCase();
            
            if (itemName.includes(searchValue) || itemDesc.includes(searchValue)) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ============================================
// Order Button Click Handler
// ============================================
const orderButtons = document.querySelectorAll('.btn-order');

orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const itemName = this.closest('.menu-card').querySelector('h4').textContent;
        const itemPrice = this.closest('.menu-card').querySelector('.menu-price').textContent;
        
        showToast(`${itemName} (${itemPrice}) added to cart!`, 'info');
    });
});

// ============================================
// Reservation Form Validation & Submission
// ============================================
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('resName').value;
        const phone = document.getElementById('resPhone').value;
        const guests = document.getElementById('resGuests').value;
        const dateTime = document.getElementById('resDateTime').value;
        const message = document.getElementById('resMessage').value;
        
        // Validation
        if (!name || !phone || !guests || !dateTime) {
            showToast('Please fill in all required fields!', 'error');
            return;
        }
        
        // Validate phone number (basic)
        if (!/^\d{10}$/.test(phone)) {
            showToast('Please enter a valid 10-digit phone number!', 'error');
            return;
        }
        
        // Validate number of guests
        if (guests < 1 || guests > 100) {
            showToast('Number of guests must be between 1 and 100!', 'error');
            return;
        }
        
        // Validate date/time (not in the past)
        const selectedDateTime = new Date(dateTime);
        const currentDateTime = new Date();
        
        if (selectedDateTime <= currentDateTime) {
            showToast('Please select a future date and time!', 'error');
            return;
        }
        
        // If all validations pass
        showSuccessToast();
        
        // Log reservation details (in real app, send to server)
        console.log({
            name: name,
            phone: phone,
            guests: guests,
            dateTime: dateTime,
            message: message,
            timestamp: new Date()
        });
        
        // Reset form
        reservationForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// Toast Notification Function
// ============================================
function showToast(message, type = 'info') {
    // Create a temporary toast for notifications
    const toastHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body" style="background: ${type === 'error' ? '#dc3545' : '#17a2b8'}; color: white; border-radius: 8px;">
                <strong>${type === 'error' ? 'Error!' : 'Info!'}</strong> ${message}
            </div>
        </div>
    `;
    
    const toastContainer = document.querySelector('.toast-container');
    const toastDiv = document.createElement('div');
    toastDiv.innerHTML = toastHTML;
    toastContainer.appendChild(toastDiv);
    
    const toastElement = toastDiv.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove toast element after it disappears
    setTimeout(() => {
        toastDiv.remove();
    }, 4000);
}

// ============================================
// Success Toast for Reservation
// ============================================
function showSuccessToast() {
    const successToast = document.getElementById('successToast');
    const toast = new bootstrap.Toast(successToast);
    toast.show();
}

// ============================================
// Smooth Scrolling Navigation
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Responsive Mobile Menu Close
// ============================================
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Close navbar on mobile when a link is clicked
        if (navbarToggler.offsetParent !== null) { // Check if mobile view
            navbarToggler.click();
        }
    });
});

// ============================================
// Gallery Hover Animation
// ============================================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Click to zoom (optional modal in real implementation)
    item.addEventListener('click', function() {
        const imageSrc = this.querySelector('img').src;
        console.log('Gallery item clicked:', imageSrc);
    });
});

// ============================================
// Menu Card Animation on Scroll
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all menu cards
menuCards.forEach(card => {
    observer.observe(card);
});

// ============================================
// Active Navbar Link Highlight
// ============================================
window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// Dynamic Date/Time Input Minimum
// ============================================
function setMinDateTime() {
    const dateTimeInput = document.getElementById('resDateTime');
    
    if (dateTimeInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        dateTimeInput.min = minDateTime;
    }
}

// Initialize min date/time on page load
document.addEventListener('DOMContentLoaded', setMinDateTime);

// ============================================
// Scroll to Top Button
// ============================================
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #d4af37, #e8d4a2);
        color: #0a0e27;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: none;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.alignItems = 'center';
            scrollBtn.style.justifyContent = 'center';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Create scroll-to-top button on DOM ready
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ============================================
// Form Input Real-time Validation
// ============================================
function setupFormValidation() {
    const phoneInput = document.getElementById('resPhone');
    const guestsInput = document.getElementById('resGuests');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    if (guestsInput) {
        guestsInput.addEventListener('input', function() {
            if (this.value > 100) this.value = 100;
            if (this.value < 1) this.value = 1;
        });
    }
}

document.addEventListener('DOMContentLoaded', setupFormValidation);

// ============================================
// Welcome Message in Console
// ============================================
console.log('%cWelcome to KBR Restro & Bar', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%cPremium Nepali Cuisine & Bar Experience', 'color: #e8d4a2; font-size: 16px;');
console.log('%cFor reservations or inquiries, contact us at info@kbrrestro.com', 'color: #a0a0a0; font-size: 12px;');

// ============================================
// Page Load Animation
// ============================================
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Set initial opacity
document.body.style.opacity = '0.95';

// ============================================
// Navbar Animation on Scroll
// ============================================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 25px rgba(212, 175, 55, 0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.1)';
    }
    
    lastScrollTop = currentScroll;
});

// ============================================
// Intersection Observer for Animations
// ============================================
const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease';
            animationObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe sections
document.querySelectorAll('.review-card, .feature, .contact-item').forEach(element => {
    animationObserver.observe(element);
});

// ============================================
// Export functionality for analytics
// ============================================
window.KBRRestro = {
    getReservationData: function() {
        return {
            website: 'KBR Restro & Bar',
            type: 'Restaurant & Bar',
            theme: 'Dark Elegant Premium',
            location: 'Kathmandu, Nepal'
        };
    },
    
    trackEvent: function(eventName, data) {
        console.log(`Event: ${eventName}`, data);
    },
    
    version: '1.0.0'
};
