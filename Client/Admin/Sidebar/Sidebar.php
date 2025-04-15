<aside>
    <div class="top">
        <div class="logo">
            <img src="../../assets/logo/logo.png" alt="logo">
        </div>
        <div class="close" id="close-btn">
            <span class="material-symbols-outlined">close</span>
        </div>
    </div>
    <div class="sidebar">
        <?php
        // Get the current file path
        $current_page = basename($_SERVER['PHP_SELF']);

        // Define sidebar links and corresponding files
        $links = [
            'AdminDashboard/AdminDashboard.php' => ['icon' => 'grid_view', 'label' => 'Dashboard'],
            'AdminForum/AdminForum.php' => ['icon' => 'forum', 'label' => 'Forums'],
            'AdminUsers/AdminUsers.php' => ['icon' => 'manage_accounts', 'label' => 'Users'],
            'AdminTsp/AdminTsp.php' => ['icon' => 'train', 'label' => 'Train Service Providers'],
            'AdminCW/AdminCW.php' => ['icon' => 'smb_share', 'label' => 'Content Writers'],
            'AdminDriver/AdminDriver.php' => ['icon' => 'directions_car', 'label' => 'Drivers'],
            'AdminAnalytics/AdminAnalytics.php' => ['icon' => 'monitoring', 'label' => 'Analytics'],
            'AdminBookings/AdminBookings.php' => ['icon' => 'confirmation_number', 'label' => 'Bookings']
        ];

        // Loop through the links and generate sidebar items
        foreach ($links as $file => $data) {
            $active_class = ($current_page === $file) ? 'active' : '';
            echo "<a href='../{$file}' class='{$active_class}'>
                    <span class='material-symbols-outlined'>{$data['icon']}</span>
                    <h3>{$data['label']}</h3>
                  </a>";
        }
        ?>
        <a href="#" id="logoutButton">
            <span class="material-symbols-outlined">logout</span>
            <h3>Logout</h3>
        </a>
    </div>
</aside>
