fetch('stations.json')
    .then(response => response.json())
    .then(stations => {
        const fromDropdown = document.getElementById('from');
        const toDropdown = document.getElementById('to');
        const trainTypeDropdown = document.getElementById('trainType');
        const stopsContainer = document.getElementById('stops');

        // Populate the "From" and "To" dropdowns
        stations.forEach(station => {
            const fromOption = document.createElement('option');
            fromOption.value = station;
            fromOption.textContent = station;
            fromDropdown.appendChild(fromOption);

            const toOption = document.createElement('option');
            toOption.value = station;
            toOption.textContent = station;
            toDropdown.appendChild(toOption);
        });

        // Populate the Train Type dropdown
        const trainTypes = ['Commuter', 'Semi-Express', 'Express'];
        trainTypes.forEach(type => {
            const typeOption = document.createElement('option');
            typeOption.value = type;
            typeOption.textContent = type;
            trainTypeDropdown.appendChild(typeOption);
        });

        // Function to update the stops checklist
        function updateStops() {
            const fromIndex = stations.indexOf(fromDropdown.value);
            const toIndex = stations.indexOf(toDropdown.value);

            if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
                stopsContainer.innerHTML = '<p>Please select valid stations.</p>';
                return;
            }

            stopsContainer.innerHTML = ''; // Clear previous stops
            const step = fromIndex < toIndex ? 1 : -1;
            const range = stations.slice(fromIndex, toIndex + step, step);

            range.forEach(station => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = station;
                checkbox.name = 'stops';
                checkbox.value = station;

                const label = document.createElement('label');
                label.htmlFor = station;
                label.textContent = station;

                const div = document.createElement('div');
                div.appendChild(checkbox);
                div.appendChild(label);
                stopsContainer.appendChild(div);
            });

            // Automatically check all stops if train type is "Commuter"
            if (trainTypeDropdown.value === 'Commuter') {
                stopsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            }
        }

        // Event listeners to update the stops dynamically
        fromDropdown.addEventListener('change', updateStops);
        toDropdown.addEventListener('change', updateStops);
        trainTypeDropdown.addEventListener('change', updateStops);
    })
    .catch(error => console.error('Error loading stations:', error));