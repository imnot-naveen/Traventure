const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

// Define the API endpoints
const sessionApiUrl = "http://yourdomain.com/api/get_session_adminid.php";
const adminDetailsApiUrl = "http://yourdomain.com/api/get_admin_details.php";

// Function to fetch admin ID from session
async function fetchAdminIdFromSession() {
    try {
        // Fetch the admin ID from session
        const response = await fetch(sessionApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        if (data.success) {
            console.log("Admin ID from Session:", data.adminid);
            return data.adminid; // Return the admin ID
        } else {
            console.error("Error:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Fetch Session Error:", error.message);
        return null;
    }
}

// Function to fetch admin details using the admin ID
async function fetchAdminDetails(adminId) {
    try {
        const response = await fetch(`${adminDetailsApiUrl}?adminid=${adminId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log("Admin Details:", data.data);
        } else {
            console.error("Error:", data.message);
        }
    } catch (error) {
        console.error("Fetch Admin Details Error:", error.message);
    }
}

// Main function to fetch session-based admin details
async function fetchSessionBasedAdminDetails() {
    const adminId = await fetchAdminIdFromSession(); // Fetch admin ID from session

    if (adminId) {
        await fetchAdminDetails(adminId); // Fetch admin details if admin ID is retrieved
    }
}

// Call the main function
fetchSessionBasedAdminDetails();
