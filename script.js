// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Newsletter form submission with API integration
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');

function showAlreadySubscribedMessage() {
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gradient-accent);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-glow-orange);
        z-index: 10000;
        animation: slideDown 0.5s ease;
        text-align: center;
        max-width: 90%;
    `;
    msg.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">💜</div>
        <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">You're Already Subscribed!</div>
        <div style="font-size: 0.875rem; opacity: 0.9;">We've got you covered</div>
    `;
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => msg.remove(), 500);
    }, 3000);
}

function showSuccessMessage(email) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gradient-primary);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-glow);
        z-index: 10000;
        animation: slideDown 0.5s ease;
        text-align: center;
        max-width: 90%;
    `;
    successMsg.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
        <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">Welcome to the Squad!</div>
        <div style="font-size: 0.875rem; opacity: 0.9;">We'll send awesome content to ${email}</div>
    `;
    document.body.appendChild(successMsg);
    setTimeout(() => {
        successMsg.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => successMsg.remove(), 500);
    }, 4000);
}

function showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 0 40px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        animation: slideDown 0.5s ease;
        text-align: center;
        max-width: 90%;
    `;
    errorMsg.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
        <div style="font-weight: 600; font-size: 1.125rem;">${message}</div>
    `;
    document.body.appendChild(errorMsg);
    setTimeout(() => {
        errorMsg.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => errorMsg.remove(), 500);
    }, 3000);
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            showErrorMessage('Please enter your email address');
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorMessage('Please enter a valid email address');
            return;
        }

        // Disable button during submission
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        try {
            // Make API request to backend
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                // Success (201)
                showSuccessMessage(email);
                emailInput.value = '';

                // Temporarily show success on button
                submitBtn.textContent = '✓ Subscribed!';
                submitBtn.style.background = 'var(--gradient-secondary)';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else if (response.status === 409) {
                // Duplicate email (409)
                showAlreadySubscribedMessage();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } else {
                // Other error (400, 500, etc.)
                showErrorMessage(data.message || 'Failed to subscribe. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            // Network error or server not running
            console.error('Subscription error:', error);
            showErrorMessage('Unable to connect to server. Please make sure the server is running.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Product card click effect
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('click', () => {
        const productTitle = card.querySelector('.product-title').textContent;
        console.log(`Clicked on: ${productTitle}`);
    });
});

// Blog card click effect
const blogCards = document.querySelectorAll('.blog-card');

blogCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking the "Read More" link
        if (!e.target.classList.contains('blog-link')) {
            const blogTitle = card.querySelector('.blog-title').textContent;
            console.log(`Clicked on blog: ${blogTitle}`);
        }
    });
});

// Add floating animation to hero section on load
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease';
    }
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add dynamic gradient animation to buttons
const buttons = document.querySelectorAll('.btn-primary');

buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
    });
});

console.log('🚀 Youthness website loaded successfully!');
