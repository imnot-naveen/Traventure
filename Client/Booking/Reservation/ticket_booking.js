const generatePassengerBtn = document.getElementById('generate-passenger-btn');
const bookTicketBtn = document.getElementById('book-ticket-btn');
const passengerDetailsContainer = document.getElementById('passenger-details-container');
const bookingSummary = document.getElementById('booking-summary');

generatePassengerBtn.addEventListener('click', function () {
  // Clear previous inputs
  passengerDetailsContainer.innerHTML = '';

  // Get the number of tickets
  const numTickets = document.getElementById('num-tickets').value;

  if (numTickets < 1) {
    alert('Please enter a valid number of tickets.');
    return;
  }

  // Dynamically generate input fields for each passenger
  for (let i = 1; i <= numTickets; i++) {
    const passengerDiv = document.createElement('div');
    passengerDiv.classList.add('passenger-info');
    passengerDiv.innerHTML = `
      <h3>Passenger ${i}</h3>
      <label for="nic-${i}">NIC</label>
      <input type="text" id="nic-${i}" required>
      <label for="gender-${i}">Gender</label>
      <select id="gender-${i}" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    `;
    passengerDetailsContainer.appendChild(passengerDiv);
  }
});

bookTicketBtn.addEventListener('click', function () {
  // Collect passenger details
  const numTickets = document.getElementById('num-tickets').value;
  const passengerDetails = [];

  window.location.href = "../Payment_gateway.html";

  for (let i = 1; i <= numTickets; i++) {
    const nic = document.getElementById(`nic-${i}`).value;
    const gender = document.getElementById(`gender-${i}`).value;

    if (!nic || !gender) {
      alert(`Please fill out details for Passenger ${i}.`);
      return;
    }

    passengerDetails.push({ nic, gender });
  }

  // Fare calculation
  const farePerTicket = 20;
  const totalFare = numTickets * farePerTicket;

  // Display summary
  const summaryDetails = passengerDetails.map(
    (p, index) => `Passenger ${index + 1}: NIC - ${p.nic}, Gender - ${p.gender}`
  ).join('<br>');

  document.getElementById('summary-details').innerHTML = summaryDetails;
  document.getElementById('total-fare').textContent = `$${totalFare}`;
  bookingSummary.classList.remove('hidden');
});
