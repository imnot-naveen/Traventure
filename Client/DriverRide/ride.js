document.addEventListener("DOMContentLoaded", () => {
    loadRideDetails();
    handleArrivedButton();
});

// Function to load initial ride details from localStorage
function loadRideDetails() {
    const fromLocation = localStorage.getItem("fromLocation") || "Unknown";
    const toLocation = localStorage.getItem("toLocation") || "Unknown";
    const distance = localStorage.getItem("distance") || "1 km";
    const time = localStorage.getItem("time") || "3 min";
    const customerName = localStorage.getItem("customerName") || "Unknown";
    const contactNumber = localStorage.getItem("contactNumber") || "Unknown";
    const passengers = localStorage.getItem("passengers") || "Unknown";

    // Display initial locations
    document.querySelector(".start").innerText = "Your location";
    document.querySelector(".end").innerText = fromLocation;
    document.querySelector(".distance").innerText = distance;
    document.querySelector(".time").innerText = time;

    // Display customer details
    document.querySelector(".details").innerHTML = `
        <p>Customer Name: ${customerName}</p><br>
        <p>Contact No: ${contactNumber}</p><br>
        <p>Number of passengers: ${passengers}</p><br>
    `;
}

// Function to handle "Arrived" button functionality
function handleArrivedButton() {
    const arrivedButton = document.querySelector(".btn-arrive");

    arrivedButton.addEventListener("click", (event) => {
        event.preventDefault();
        
        // Update ride details
        updateRideForReturnJourney();

        // Change button to "Finished"
        arrivedButton.innerText = "Finished";
        arrivedButton.classList.add("btn-finish");

        // Optionally, you can set up an event listener for "Finished" action here
        arrivedButton.removeEventListener("click", handleArrivedButton);
        arrivedButton.addEventListener("click", handleFinish);
    });
}

// Function to update ride details for the return journey
function updateRideForReturnJourney() {
    // Swap from and to locations
    const currentFromLocation = document.querySelector(".end").innerText;
    const currentToLocation = localStorage.getItem("toLocation") || "Unknown";

    document.querySelector(".start").innerText = currentFromLocation;
    document.querySelector(".end").innerText = currentToLocation;

    // Update distance and time (replace with actual values as needed)
    document.querySelector(".distance").innerText = "2 km"; // Example updated distance
    document.querySelector(".time").innerText = "5 min";    // Example updated time
}

// Function to handle "Finished" button action
function handleFinish() {
    alert("Ride finished. Thank you!");
    // Optional: Clear ride details from localStorage or reset the page
    localStorage.removeItem("fromLocation");
    localStorage.removeItem("toLocation");
    localStorage.removeItem("distance");
    localStorage.removeItem("time");
    localStorage.removeItem("customerName");
    localStorage.removeItem("contactNumber");
    localStorage.removeItem("passengers");

    // Redirect to a different page or refresh the page if needed
    window.location.href = "../DriverNotification/notification.html"; // Example: Navigate to a completion page
}


