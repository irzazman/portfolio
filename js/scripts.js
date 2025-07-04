document.addEventListener('DOMContentLoaded', function() {
    // EmailJS initialization
    emailjs.init('tG8REqw9Yyl2xE10d');
    
    // Scroll Progress Bar
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgressBar.style.width = scrollPercent + '%';
        
        // Add/remove blur effect based on scroll position
        if (scrollTop > 50) { // Start blurring after 50px scroll
            scrollProgress.classList.add('blurred');
        } else {
            scrollProgress.classList.remove('blurred');
        }
    }
    
    // Update progress on scroll
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial call to set progress bar
    updateScrollProgress();
    
    // Theme toggling functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use default
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Toggle icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Contact Info Click Handlers
    // 1. Email: open default email client
    document.querySelectorAll('.contact-list a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Let default mailto behavior happen
        });
    });

    // 2. Phone: open WhatsApp chat
    document.querySelectorAll('.contact-list a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with your WhatsApp number (without dashes, with country code)
            const phone = '60142312646';
            const waUrl = `https://wa.me/${phone}`;
            window.open(waUrl, '_blank');
        });
    });

    // 3. LinkedIn: open LinkedIn profile
    document.querySelectorAll('.contact-list a[href*="linkedin.com"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.linkedin.com/in/mohamadazriazman', '_blank');
        });
    });

    // 4. GitHub: open GitHub profile
    document.querySelectorAll('.contact-list a[href*="github.com"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://github.com/irzazman', '_blank');
        });
    });

    // Form validation
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validateInput(input, validationFunction) {
        const isValid = validationFunction(input.value.trim());
        
        if (!isValid) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        }
    }
    
    // Real-time validation
    nameInput.addEventListener('input', function() {
        validateInput(nameInput, value => value.length >= 2);
    });
    
    emailInput.addEventListener('input', function() {
        validateInput(emailInput, validateEmail);
    });
    
    messageInput.addEventListener('input', function() {
        validateInput(messageInput, value => value.length >= 10);
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const nameValid = validateInput(nameInput, value => value.length >= 2);
        const emailValid = validateInput(emailInput, validateEmail);
        const messageValid = validateInput(messageInput, value => value.length >= 10);
        
        // If all fields are valid, send the form
        if (nameValid && emailValid && messageValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // EmailJS service configuration
            const serviceID = 'service_9hi3zs7';
            const templateID = 'template_kzjxz5i'; 
            
            const templateParams = {
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                to_name: 'Mohamad Azri Bin Azman' 
            };
            
            // Send email using EmailJS
            emailjs.send(serviceID, templateID, templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    const formAlert = document.createElement('div');
                    formAlert.className = 'alert alert-success mt-3';
                    formAlert.role = 'alert';
                    formAlert.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully! I\'ll get back to you soon.';
                    contactForm.appendChild(formAlert);
                    
                    // Reset form
                    contactForm.reset();
                    nameInput.classList.remove('is-valid');
                    emailInput.classList.remove('is-valid');
                    messageInput.classList.remove('is-valid');
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        if (formAlert.parentNode) {
                            formAlert.remove();
                        }
                    }, 5000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    const formAlert = document.createElement('div');
                    formAlert.className = 'alert alert-danger mt-3';
                    formAlert.role = 'alert';
                    formAlert.innerHTML = '<i class="fas fa-exclamation-circle"></i> There was an error sending your message. Please try again later or contact me directly at azriazman1202@gmail.com';
                    contactForm.appendChild(formAlert);
                    
                    // Remove error message after 7 seconds
                    setTimeout(() => {
                        if (formAlert.parentNode) {
                            formAlert.remove();
                        }
                    }, 7000);
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        }
    });

    // Footer Social Links
    // 1. LinkedIn in footer
    document.querySelectorAll('footer .social-links a[href*="linkedin.com"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.linkedin.com/in/mohamadazriazman', '_blank');
        });
    });

    // 2. GitHub in footer
    document.querySelectorAll('footer .social-links a[href*="github.com"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://github.com/irzazman', '_blank');
        });
    });
    
    // Analytics visibility toggle (for your eyes only)
    const analyticsSection = document.querySelector('.private-analytics');
    if (analyticsSection) {
        // Only show analytics to the site owner (you can implement a more secure method)
        // This is just a simple demo - in a real app you'd use proper authentication
        const isOwner = localStorage.getItem('isOwner');
        if (!isOwner) {
            analyticsSection.style.display = 'none';
        }
        
        // Add a hidden way to view analytics (double click on your name)
        const nameHeading = document.querySelector('header h1');
        if (nameHeading) {
            nameHeading.addEventListener('dblclick', function() {
                analyticsSection.style.display = 'block';
                localStorage.setItem('isOwner', 'true');
            });
        }
    }
});

