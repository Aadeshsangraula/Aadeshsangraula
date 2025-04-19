document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            if (!formValues.name || !formValues.email || !formValues.message) {
                showMessage('Please fill in all required fields', 'error');
                return;
            }
            
            // Here you would typically send the form data to your backend
            // For demonstration, we'll simulate a successful submission
            simulateFormSubmission(formValues);
        });
    }
    
    function simulateFormSubmission(data) {
        // In a real implementation, you would use fetch() to send data to your backend
        console.log('Form data to be sent:', data);
        
        // Simulate API call delay
        setTimeout(() => {
            showMessage('Your message has been sent successfully!', 'success');
            contactForm.reset();
        }, 1500);
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = '';
        formMessage.classList.add(type);
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.opacity = '0';
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = '';
                formMessage.style.opacity = '1';
            }, 500);
        }, 5000);
    }
});

// For a real implementation, you would replace the simulateFormSubmission function with:
/*
async function submitForm(data) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Your message has been sent successfully!', 'success');
            contactForm.reset();
        } else {
            showMessage(result.error || 'Error sending message', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again later.', 'error');
    }
}
*/
