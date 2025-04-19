document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const messageDiv = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    // Nepal-specific backend URL
    const backendUrl = window.location.host.includes('com.np') 
      ? 'https://api.yourdomain.com.np'
      : 'http://localhost:5000';

    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      showMessage(
        data.message || 'Message sent successfully!',
        response.ok ? 'success' : 'error'
      );
      
      if (response.ok) form.reset();
    } catch (error) {
      showMessage(
        'Connection error. Please try again later.',
        'error'
      );
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => {
        messageDiv.style.display = 'none';
        messageDiv.style.opacity = '1';
      }, 500);
    }, 5000);
  }
});
