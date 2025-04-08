document.addEventListener("DOMContentLoaded", function() {
  // Your payment setup and startPayment call here
  const payment = {
    sandbox: true,
    merchant_id: "1228073",
    order_id: "TRAV" + Date.now(),
    items: "Train Booking: " + (booking.tripDetails || "Colombo to Kandy"),
    amount: parseFloat(booking.totalAmount.replace("$", "")) * 200,
    currency: "LKR",
    first_name: booking.firstName || "Traventure",
    last_name: booking.lastName || "User",
    email: booking.email || "user@example.com",
    phone: booking.phone || "0771234567",
    address: booking.address || "No 1, Galle Road",
    city: booking.city || "Colombo",
    country: "Sri Lanka",
    return_url: "https://localhost/Traventure/Client/Booking/BookingConfirm/bookingconfirm.html",
    cancel_url: "https://yourdomain.com/booking.html",
    notify_url: "https://yourdomain.com/api/payhere_notify.php"
  };
  
  payhere.startPayment(payment);
});
