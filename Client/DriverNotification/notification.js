document.addEventListener("DOMContentLoaded", () => {
    const acceptButtons = document.querySelectorAll(".accept-button");
    const declineButtons = document.querySelectorAll(".decline-button");

    acceptButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            navigateToRideDetails(event.target);
        });
    });

    declineButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            removeNotification(event.target);
        });
    });
});

// Function to navigate to ride.html with ride details
function navigateToRideDetails(button) {
    const notification = button.closest(".notification");
    const time = notification.querySelector("h2").innerText;
    const locationText = notification.querySelector("p").innerText;

    // Split the location text by " - " to get 'from' and 'to' locations
    const [fromLocation, toLocation] = locationText.split(" - ");

    // Store the ride details in localStorage
    localStorage.setItem("rideTime", time);
    localStorage.setItem("fromLocation", fromLocation);
    localStorage.setItem("toLocation", toLocation);

    // Navigate to ride.html
    window.location.href = "../DriverRide/ride.html";
}

// Function to remove the notification on "Decline"
function removeNotification(button) {
    const notification = button.closest(".notification");
    notification.remove();
}
