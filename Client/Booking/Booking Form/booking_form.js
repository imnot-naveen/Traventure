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

  try {
    const response = await fetch('http://localhost/Traventure/Server/api/createBooking.php?user_id=2', {
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
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
  }
});