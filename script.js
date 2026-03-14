// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = question.nextElementSibling;

        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) {
                other.classList.remove('active');
                other.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// ===== GALLERY CAROUSEL =====
const track = document.getElementById('carouselTrack');
const slides = track.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');
let currentSlide = 0;
let startX = 0;
let isDragging = false;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Arrow buttons
prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Touch swipe support
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
}, { passive: true });

track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
});

// ===== PHONE NUMBER FORMATTING =====
const phoneInput = document.getElementById('phoneInput');
const phoneError = document.getElementById('phoneError');

function formatPhoneNumber(value) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = digits.substring(0, 10);
    
    // Build formatted string as user types
    if (limited.length === 0) {
        return '';
    } else if (limited.length <= 3) {
        return '(' + limited;
    } else if (limited.length <= 6) {
        return '(' + limited.substring(0, 3) + ') ' + limited.substring(3);
    } else {
        return '(' + limited.substring(0, 3) + ') ' + limited.substring(3, 6) + '-' + limited.substring(6);
    }
}

function isValidPhone(value) {
    // Empty is valid (field is optional)
    if (value.trim() === '') return true;
    // Must match (123) 456-7890 format exactly
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(value);
}

phoneInput.addEventListener('input', (e) => {
    const cursorPos = e.target.selectionStart;
    const beforeFormat = e.target.value;
    const formatted = formatPhoneNumber(beforeFormat);
    e.target.value = formatted;
    
    // Clear error while typing
    if (formatted === '' || isValidPhone(formatted)) {
        phoneInput.classList.remove('input-error');
        phoneInput.classList.toggle('input-valid', formatted !== '' && isValidPhone(formatted));
        phoneError.classList.remove('show');
    }
});

phoneInput.addEventListener('blur', () => {
    const value = phoneInput.value.trim();
    if (value !== '' && !isValidPhone(value)) {
        phoneInput.classList.add('input-error');
        phoneInput.classList.remove('input-valid');
        phoneError.classList.add('show');
    } else if (value !== '' && isValidPhone(value)) {
        phoneInput.classList.remove('input-error');
        phoneInput.classList.add('input-valid');
        phoneError.classList.remove('show');
    } else {
        phoneInput.classList.remove('input-error', 'input-valid');
        phoneError.classList.remove('show');
    }
});

// ===== FORM VALIDATION & SUBMISSION =====
const contactForm = document.getElementById('contactForm');
const nameInput = contactForm.querySelector('[name="name"]');
const emailInput = contactForm.querySelector('[name="email"]');
const messageInput = contactForm.querySelector('[name="message"]');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// Real-time validation on blur for all fields
nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim() === '') {
        nameInput.classList.add('input-error');
        nameInput.classList.remove('input-valid');
        nameError.classList.add('show');
    } else {
        nameInput.classList.remove('input-error');
        nameInput.classList.add('input-valid');
        nameError.classList.remove('show');
    }
});

nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
        nameInput.classList.remove('input-error');
        nameInput.classList.add('input-valid');
        nameError.classList.remove('show');
    }
});

emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('input-error');
        emailInput.classList.remove('input-valid');
        emailError.classList.add('show');
    } else {
        emailInput.classList.remove('input-error');
        emailInput.classList.add('input-valid');
        emailError.classList.remove('show');
    }
});

emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('input-error');
        emailInput.classList.add('input-valid');
        emailError.classList.remove('show');
    }
});

messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim() === '') {
        messageInput.classList.add('input-error');
        messageInput.classList.remove('input-valid');
        messageError.classList.add('show');
    } else {
        messageInput.classList.remove('input-error');
        messageInput.classList.add('input-valid');
        messageError.classList.remove('show');
    }
});

messageInput.addEventListener('input', () => {
    if (messageInput.value.trim() !== '') {
        messageInput.classList.remove('input-error');
        messageInput.classList.add('input-valid');
        messageError.classList.remove('show');
    }
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate name
    if (nameInput.value.trim() === '') {
        nameInput.classList.add('input-error');
        nameError.classList.add('show');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('input-error');
        emailError.classList.add('show');
        isValid = false;
    }
    
    // Validate phone (only if something was entered)
    if (phoneInput.value.trim() !== '' && !isValidPhone(phoneInput.value.trim())) {
        phoneInput.classList.add('input-error');
        phoneError.classList.add('show');
        isValid = false;
    }
    
    // Validate message
    if (messageInput.value.trim() === '') {
        messageInput.classList.add('input-error');
        messageError.classList.add('show');
        isValid = false;
    }
    
    // Stop if validation fails
    if (!isValid) return;
    
    // All valid — submit
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        message: messageInput.value
    };
    
    fetch('https://script.google.com/macros/s/AKfycbz7COCN05iV_BsYhXiLmquGYEhS4pT_b-K_3XE6AWwewNphKN8VF6hLHDhrQxg0y8TOmQ/exec', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'text/plain'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            contactForm.innerHTML = '<div class="form-success"><i class="fas fa-check-circle"></i><h3>Message Sent!</h3><p>Thank you for reaching out. We\'ll get back to you soon!</p></div>';
        } else {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Oops! Something went wrong. Please try calling us at (705) 391-7116.');
        }
    })
    .catch(error => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('Oops! Something went wrong. Please try calling us at (705) 391-7116.');
    });
});

// Scroll Animations
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

animateElements.forEach(el => observer.observe(el));

// ===== STICKY MOBILE BAR =====
const stickyBar = document.getElementById('stickyBar');
const heroSection = document.getElementById('hero');

function toggleStickyBar() {
    if (!stickyBar) return;

    // Show bar once user scrolls past the hero section
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom - 200) {
        stickyBar.classList.add('visible');
    } else {
        stickyBar.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleStickyBar);
window.addEventListener('load', toggleStickyBar);