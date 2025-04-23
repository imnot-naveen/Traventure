const stripe = Stripe('pk_test_51RCy68QwgaoFWhBRVwTGwX9QkMDGiSKTNE1QGHYnM4YqSSTeIgdIlCTw34rqwYcIJxKT1jfXr6fkl5SM3ABac2mY00iwkPeUmO'); // your key

const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
const totalFare = bookingDetails.total_fare;

fetch('http://localhost/Traventure/Server/api/create_checkout_session.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: totalFare })
})
.then(res => res.json())
.then(data => {
  if (data.id) {
    return stripe.redirectToCheckout({ sessionId: data.id });
  } else {
    console.error("Stripe session creation failed", data);
  }
})
.catch(error => {
  console.error("Stripe Checkout error:", error);
});
