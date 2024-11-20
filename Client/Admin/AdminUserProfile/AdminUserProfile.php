<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile | Admin</title>
  <link rel="stylesheet" href="AdminUserProfile-v2.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
    <aside>
    <div class="top">
                <div class="logo">
                    <img src="../../assets/logo/logo.png" alt="logo">
                </div>
                <div class="close" id="close-btn">
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </div>
            </div>
            <div class="sidebar">
                <a href="../AdminDashboard/AdminDashboard.html">
                    <span class="material-symbols-outlined">
                        grid_view
                    </span>
                    <h3>Dashboard</h3>
                </a>
                <a href="../AdminForum/AdminForum.html">
                    <span class="material-symbols-outlined">
                        forum
                    </span>
                    <h3>Forums</h3>
                </a>
                <a href="#" class="active">
                    <span class="material-symbols-outlined">
                        manage_accounts
                    </span>
                    <h3>Users</h3>
                </a>
                <a href="../AdminAnalytics/AdminAnalytics.html">
                    <span class="material-symbols-outlined">
                        monitoring
                    </span>
                    <h3>Analytics</h3>
                </a>
                <a href="../AdminBookings/AdminBookings.html">
                    <span class="material-symbols-outlined">
                        report
                    </span>
                    <h3>Bookings</h3>
                </a>
                <a href="#">
                    <span class="material-symbols-outlined">
                        logout
                    </span>
                    <h3>Logout</h3>
                </a>
            </div>
    </aside>

    <main>
  <div class="profile-container">
    <div class="profile-details">
      <img src="../../assets/img/AvatarMaker.png" alt="User Image">
      <h2>Dimuthu Harshamal</h2>
      <p class="role">Role: User</p>
      <p class="email">Email: dimuthuharshamal@gmail.com</p>
      <p class="contact">Contact No: +94750737225</p>
      <div class="buttons">
        <button id="update">Update</button>
        <button id="delete">Delete Account</button>
      </div>
    </div>
  </div>
  <div class="user-history">
    <h3>User History</h3>
    <!-- User History content here -->
  </div>
</div>
        </main>

        <div class="right">
            <div class="top">
                <button id="menu-btn">
                    <span class="material-symbols-outlined">
                        menu
                        </span>
                </button>
                <div class="profile">
                    <div class="info">
                        <p>Hey, <b>Dimuthu</b></p>
                        <small class="text-muted">Admin</small>
                    </div>
                    <div class="profile-photo">
                        <span class="material-symbols-outlined">
                            account_circle
                            </span>
                    </div>
                </div>
            </div>
            <!-- END OF TOP --> 
        </div>
  </div>

 <script src="AdminUserProfile.js"></script>
</body>
</html>