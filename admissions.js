// Admissions page JavaScript
console.log('Admissions page JavaScript loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
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
            
            if (isValid) {
                // Show success message
                if (window.EMRS && window.EMRS.showNotification) {
                    window.EMRS.showNotification('Form submitted successfully! We will contact you soon.', 'success');
                } else {
                    alert('Form submitted successfully! We will contact you soon.');
                }
                
                // Reset form
                this.reset();
            } else {
                if (window.EMRS && window.EMRS.showNotification) {
                    window.EMRS.showNotification('Please fill in all required fields.', 'error');
                } else {
                    alert('Please fill in all required fields.');
                }
            }
        });
    });
    
    // Add animation to admission steps
    const steps = document.querySelectorAll('.admission-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-30px)';
        step.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(step);
    });
});
