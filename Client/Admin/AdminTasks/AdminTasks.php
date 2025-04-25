<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin | Tasks</title>
  <link rel="stylesheet" href="AdminTasks.css">
  <link rel="stylesheet" href="../LogoutModal/logoutModal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
      <h1>Tasks</h1>
      <div class="tasks-grid">
        <!-- Fare Rates Section -->
        <div class="task-card">
          <div class="task-header">
            <h3>Fare Rates</h3>
            <span class="material-symbols-outlined">payments</span>
          </div>
          <div class="task-content">
            <div class="current-rates">
              <h4>Current Rates</h4>
              <div class="rates-list" id="fareRatesList">
                <!-- Fare rates will be populated here via JS -->
                <p class="loading">Loading fare rates...</p>
              </div>
            </div>
            <div class="update-rates">
              <h4>Update Rates</h4>
              <form id="fareRatesForm">
                <div class="form-group">
                  <label for="rateType">Class</label>
                  <select id="rateType" name="rateType" required>
                    <option value="">Select Class</option>
                    <option value="first">1st Class</option>
                    <option value="second">2nd Class</option>
                    <option value="third">3rd Class</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="baseFare">Base Fare (LKR)</label>
                  <input type="number" id="baseFare" name="baseFare" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                  <label for="perKmRate">Per Km Rate (LKR)</label>
                  <input type="number" id="perKmRate" name="perKmRate" step="0.01" min="0" required>
                </div>
                <button type="submit" class="btn">Update Rate</button>
              </form>
            </div>
          </div>
        </div>

        <!-- Destination Types Section -->
        <div class="task-card">
          <div class="task-header">
            <h3>Destination Types</h3>
            <span class="material-symbols-outlined">location_on</span>
          </div>
          <div class="task-content">
            <div class="current-destinations">
              <h4>Current Destination Types</h4>
              <div class="destinations-list" id="destinationTypesList">
                <!-- Destination types will be populated here via JS -->
                <p class="loading">Loading destination types...</p>
              </div>
            </div>
            <div class="update-destinations">
              <h4>Add Destination Type</h4>
              <form id="destinationTypesForm" enctype="multipart/form-data">
                <div class="form-group">
                  <label for="destType">Destination Type</label>
                  <input type="text" id="destType" name="destType" required>
                </div>
                <div class="form-group">
                  <label for="destPhoto">Photo</label>
                  <input type="file" id="destPhoto" name="destPhoto" accept="image/*" required>
                </div>
                <button type="submit" class="btn">Add Type</button>
              </form>
            </div>  
          </div>
        </div>

    </main>

    <div class="right">
      <?php include '../Recent_updates/Recent.php'; ?>
    </div>
  </div>
 
  <?php include '../LogoutModal/logoutModal.php'; ?>

  <script src="../LogoutModal/logoutModal.js"></script>
  <script src="AdminTasks.js"></script>
  <script src="../Recent_updates/Recent.js"></script>
</body>
</html>