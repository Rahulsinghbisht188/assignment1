/**
 * LuxeSpin Premium Laundry & Dry Cleaning Services - Frontend Interaction Suite
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. EmailJS Initialization ---
  // To use your actual EmailJS account, replace these values with your own keys:
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with EmailJS Public Key
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with EmailJS Service ID
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with EmailJS Template ID

  // Initialize the browser SDK
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
    console.log('LuxeSpin: EmailJS SDK successfully loaded and initialized.');
  } else {
    console.error('LuxeSpin: EmailJS SDK could not be loaded from CDN.');
  }

  // --- 2. Booking Form Handler & Email.js Dispatcher ---
  const bookingForm = document.getElementById('booking-form');
  const bookingBtn = document.getElementById('btn-book-now');
  const confirmationMsg = document.getElementById('booking-confirmation');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent standard page reloads
      
      // Update button state to show progress
      const originalBtnText = bookingBtn.innerHTML;
      bookingBtn.disabled = true;
      bookingBtn.innerHTML = '<span>Processing booking...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      // Parse form input fields
      const name = document.getElementById('booking_name').value.trim();
      const email = document.getElementById('booking_email').value.trim();
      const phone = document.getElementById('booking_phone').value.trim();
      const service = document.getElementById('booking_service').value;
      const date = document.getElementById('booking_date').value;

      // Bundle parameters for EmailJS template
      const templateParams = {
        to_name: name,
        from_name: 'LuxeSpin Care Team',
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        service_type: service,
        pickup_date: date,
        reply_to: email,
      };

      console.log('LuxeSpin: Attempting to dispatch email parameters via EmailJS:', templateParams);

      let emailSentSuccessfully = false;

      // Only make the API request if keys are configured (not default placeholders)
      if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
        try {
          const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
          console.log('LuxeSpin: EmailJS Response SUCCESS!', response.status, response.text);
          emailSentSuccessfully = true;
        } catch (error) {
          console.error('LuxeSpin: EmailJS FAILED to transmit:', error);
          // Fallback graceful flow even on API transmission errors
        }
      } else {
        // Dev / Demonstration fallback mode
        console.warn('LuxeSpin: EmailJS is initialized with placeholder parameters. Simulating secure email dispatch.');
        // We will pause for 1 second to create a premium, realistic loading feel
        await new Promise(resolve => setTimeout(resolve, 1000));
        emailSentSuccessfully = true;
      }

      // --- 3. UI State Progression (Success Message Display) ---
      if (emailSentSuccessfully) {
        // Reset the form fields safely
        bookingForm.reset();
        
        // Return button back to standard
        bookingBtn.disabled = false;
        bookingBtn.innerHTML = originalBtnText;

        // Slide down the required confirmation message below the button
        confirmationMsg.style.display = 'block';
        
        // Automatically scroll to view the confirmation notice smoothly
        confirmationMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Let the confirmation message display for 8 seconds, then fade out gently
        setTimeout(() => {
          confirmationMsg.style.animation = 'slideDown 0.4s ease reverse forwards';
          setTimeout(() => {
            confirmationMsg.style.display = 'none';
            confirmationMsg.style.animation = 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'; // Reset animation state
          }, 400);
        }, 8000);
      } else {
        // If everything failed and could not simulate, show error state on button
        bookingBtn.disabled = false;
        bookingBtn.innerHTML = '<span>Failed to Book. Try Again</span> <i class="fa-solid fa-triangle-exclamation"></i>';
        setTimeout(() => {
          bookingBtn.innerHTML = originalBtnText;
        }, 3000);
      }
    });
  }

  // --- 4. Newsletter Subscription Form Handler ---
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterBtn = document.getElementById('btn-subscribe');
  const newsletterSuccess = document.getElementById('newsletter-success-msg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show processing state
      const originalText = newsletterBtn.innerHTML;
      newsletterBtn.disabled = true;
      newsletterBtn.innerHTML = '<span>Subscribing...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

      const subName = document.getElementById('newsletter_name').value.trim();
      const subEmail = document.getElementById('newsletter_email').value.trim();

      console.log(`LuxeSpin: Registering user to newsletter. Name: ${subName}, Email: ${subEmail}`);

      // Simulate a small network delay for a high-quality feel
      await new Promise(resolve => setTimeout(resolve, 800));

      newsletterForm.reset();
      newsletterBtn.disabled = false;
      newsletterBtn.innerHTML = originalText;

      // Display dynamic success feedback
      newsletterSuccess.style.display = 'block';

      // Reset feedback after 6 seconds
      setTimeout(() => {
        newsletterSuccess.style.display = 'none';
      }, 6000);
    });
  }

  // --- 5. Interactive Navigation Bar Scroll Effect ---
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check on load
  handleScroll();

  // --- 6. Responsive Mobile Navigation Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link-item, .btn-nav-mobile');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger icon states
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars-staggered';
      }
    });

    // Close navigation menu once any link is clicked (for single page smooth anchors)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
      });
    });
  }
});
