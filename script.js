/* ================================
   INTERACTIVE JAVASCRIPT FUNCTIONALITY
   ================================ */

// Track Package Function
function trackPackage(event) {
    event.preventDefault();
    const trackingNumber = event.target.querySelector('input').value;
    
    if (trackingNumber.trim() === '') {
        alert('Please enter a tracking number');
        return;
    }
    
    // Simulate tracking
    alert(`Tracking package: ${trackingNumber}\n\nStatus: In Transit\nExpected Delivery: 2-3 days\nCurrent Location: Distribution Center`);
    event.target.reset();
}

// Contact Form Submission
function submitContact(event) {
    event.preventDefault();
    
    const formData = {
        name: event.target.querySelector('input[type="text"]').value,
        email: event.target.querySelector('input[type="email"]').value,
        message: event.target.querySelector('textarea').value
    };
    
    console.log('Contact Form Submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    event.target.reset();
}

// Mobile Menu Toggle
document.getElementById('mobileToggle')?.addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu.style.display === 'none' || navMenu.style.display === '') {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '60px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'white';
        navMenu.style.padding = '20px';
        navMenu.style.zIndex = '999';
    } else {
        navMenu.style.display = 'none';
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});

// Animate numbers on scroll
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const finalValue = parseInt(num.textContent);
                let currentValue = 0;
                const increment = finalValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        num.textContent = finalValue + '+';
                        clearInterval(counter);
                    } else {
                        num.textContent = Math.floor(currentValue) + '+';
                    }
                }, 30);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add animation on scroll for service items
const serviceItems = document.querySelectorAll('.service-item');
const serviceObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 0.6s ease-in-out';
        }
    });
}, { threshold: 0.1 });

serviceItems.forEach(item => {
    item.style.opacity = '0';
    serviceObserver.observe(item);
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('Depot Shipping Website - All scripts loaded successfully!');
