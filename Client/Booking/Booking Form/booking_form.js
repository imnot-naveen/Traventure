const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const passengers = document.getElementById('passengers').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const paymentStatus = document.getElementById('paymentStatus').value;

  if (!passengers || !paymentMethod || !paymentStatus) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const bookingData = {
    no_of_passengers: passengers,
    paymentMethod,
    paymentStatus
  };

  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  try {
    const userId = sessionStorage.getItem('user_id') || 2; // Default to 2 for testing
    const response = await fetch(`http://localhost/Traventure/Server/api/createBooking.php?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    if (result.success) {
      alert('Booking created successfully!');
      bookingForm.reset();
      if (paymentMethod === 'Card') {
        console.log('Redirecting to Gateway.html...');
        window.location.href = "../Gateway/Gateway.html";
      }
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit';
  }
});
