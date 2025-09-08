// Contact page JavaScript
console.log('Contact page JavaScript loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            // Email validation
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    emailField.style.borderColor = '#ddd';
                }
            }
            
            if (isValid) {
                // Show success message
                if (window.EMRS && window.EMRS.showNotification) {
                    window.EMRS.showNotification('Message sent successfully! We will get back to you soon.', 'success');
                } else {
                    alert('Message sent successfully! We will get back to you soon.');
                }
                
                // Reset form
                this.reset();
            } else {
                if (window.EMRS && window.EMRS.showNotification) {
                    window.EMRS.showNotification('Please fill in all required fields correctly.', 'error');
                } else {
                    alert('Please fill in all required fields correctly.');
                }
            }
        });
    }
    
    // Map interaction
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            // Open Google Maps in new tab
            window.open('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.8968663!2d79.0944745!3d15.8968663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb54159e35ef989%3A0xd002dcf5690b3dc7!2sEMRS%20DORNALA!5e0!3m2!1sen!2sin!4v1641234567890!5m2!1sen!2sin', '_blank');
        });
    }
});
