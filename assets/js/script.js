const io_base_url = 'https://reptile2.developmentpath.co.uk/tui/christmas-markets/';

let map; // Variabel global untuk peta

// Deklarasikan appVars di luar blok if
let appVars;

if (typeof appVars === 'undefined') {
    appVars = {
        daysOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        mapInstance: {},           // Instance of the map
        markers: [],               // Daftar marker yang ditampilkan pada peta.
        markerIcons: {},           // Objek yang menyimpan ikon untuk marker.
        initialMarkers: [],        // Menyimpan data marker awal yang diambil dari sumber eksternal.
        nearbyMarkers: [],         // Menyimpan data marker yang berada di sekitar lokasi tertentu
        searchLocation: {},        // Menyimpan data lokasi yang sedang dicari.
        defaultLocation: { lat: 51.5074, lng: -0.1278 },  // Default location (e.g., London, UK)
        defaultLocationName: 'London, UK',                // Name of the default location
        inputDate: '',             // Tanggal yang diinput oleh pengguna.
        inputTime: '',             // Waktu yang diinput oleh pengguna.
        isFiltered: false,         // Status apakah data telah difilter atau tidak.
        searchRadius: 160934,      // Radius pencarian dalam satuan meter (160934 meter adalah 100 mil).
    };
}

// Variabel ini menyimpan jam operasional biasa, dengan jam buka mulai dari 08:00 atau 09:00 dan jam tutup antara 21:00 hingga 23:00 tergantung pada hari.
const standardOpeningHours = [
    { open: '08:00', close: '23:00' },  // Sunday
    { open: '09:00', close: '21:00' },  // Monday
    { open: '09:00', close: '21:00' },  // Tuesday
    { open: '09:00', close: '21:00' },  // Wednesday
    { open: '09:00', close: '21:00' },  // Thursday
    { open: '09:00', close: '21:00' },  // Friday
    { open: '08:00', close: '23:00' }   // Saturday
];

// Variabel ini menyimpan data jam operasional yang panjang, dengan jam buka mulai dari 00:01 dan jam tutup pada 23:58 setiap hari.
const extendedOpeningHours = [
    { open: '00:01', close: '23:58' },  // Sunday
    { open: '00:01', close: '23:58' },  // Monday
    { open: '00:01', close: '23:58' },  // Tuesday
    { open: '00:01', close: '23:58' },  // Wednesday
    { open: '00:01', close: '23:58' },  // Thursday
    { open: '00:01', close: '23:58' },  // Friday
    { open: '00:01', close: '23:58' }   // Saturday
];

// Variabel ini menyimpan data jam operasional selama 24 jam penuh, dari 00:00 hingga 23:59 setiap hari.
const fullDayOpeningHours = [
    { open: '00:00', close: '23:59' },  // Sunday
    { open: '00:00', close: '23:59' },  // Monday
    { open: '00:00', close: '23:59' },  // Tuesday
    { open: '00:00', close: '23:59' },  // Wednesday
    { open: '00:00', close: '23:59' },  // Thursday
    { open: '00:00', close: '23:59' },  // Friday
    { open: '00:00', close: '23:59' }   // Saturday
];

// Fungsi untuk inisialisasi peta Google Maps
async function initMap() {
    const mapOptions = {
        center: appVars.defaultLocation, // London, Inggris
        zoom: 5,
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    try {
        const data = await fetchData(`${io_base_url}assets/data.json`);
        const markets = processMarketData(data);

        addMarkersToMap(markets);
        displayMarketDetails(markets);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fungsi untuk mengambil data dari URL
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Fungsi untuk memproses data pasar
function processMarketData(data) {
    return data.map((market, index) => {
        // Penentuan Jam Operasional dan Tanggal Pembukaan
        if (index % 2 === 0) {
            market.openingHours = [...extendedOpeningHours];
            market.openingDate = { open: '2023-10-01', close: '2024-01-10' };
        } else if (index % 3 === 0) {
            market.openingHours = [...standardOpeningHours];
            market.openingDate = { open: '2023-12-01', close: '2024-01-10' };
        } else if (index % 5 === 0) {
            market.openingHours = [];
            market.openingDate = {};
        } else {
            market.openingHours = [...standardOpeningHours];
            market.openingDate = { open: '2023-10-01', close: '2024-01-10' };
        }

        // Hitung jarak dari lokasi default
        market.distance = haversineDistance(appVars.defaultLocation, { lat: market.gps.lat, lng: market.gps.lng });

        return market;
    });
}

// Fungsi untuk menambahkan marker ke peta
function addMarkersToMap(markets) {
    markets.forEach((market) => {
        const marker = new google.maps.Marker({
            position: { lat: market.gps.lat, lng: market.gps.lng },
            map,
            title: market.name,
        });

        google.maps.event.addListener(marker, 'click', () => {
            showMarkerDetails(market);
        });
    });
}

// Fungsi untuk menampilkan detail pasar
function displayMarketDetails(markets) {
    // Urutkan markets berdasarkan distance
    markets.sort((a, b) => a.distance - b.distance);

    // Hapus konten sebelumnya
    locationList.innerHTML = '';

    markets.forEach(market => {
        const imageId = market.imageIdList[0];
        const imageUrl = `${io_base_url}backend/assets/dynamic/${imageId}-small.jpg`;

        const blockLocation = document.createElement('div');
        blockLocation.classList.add('block-location', 'markerDetail');
        blockLocation.setAttribute('data-lat', market.gps.lat);
        blockLocation.setAttribute('data-lng', market.gps.lng);

        const openingDateString = market.openingDate && market.openingDate.open ? formatDateRange(market.openingDate) : 'Unknown';
        const distanceString = `${market.distance.toFixed(2)} km`;

        blockLocation.innerHTML = `
            <div class="block-thumb">
                <img src="${imageUrl}" alt="Market Image">
            </div>
            <div class="block-body">
                <h4 class="location-name">${market.name}</h4>
                <p class="location-address">${market.address}</p>
                <div class="distance">Distance: ${distanceString}</div>
                <a class="label label-open">open</a>
            </div>
            <div class="block-body body-expand">
                <div class="opening-date">
                    <div><strong>Opening Date:</strong> ${openingDateString}</div>
                    <p>
                        <a class="btn btn-detail" onclick="showMarkerDetail(${market.id})"><i class="bi bi-geo-fill"></i> View Details</a>
                        <a class="btn btn-save" onclick="updateCount('savedBtn')"><i class="bi bi-heart-fill"></i> Save Location</a>
                    </p>
                </div>
            </div>
        `;

        locationList.appendChild(blockLocation);

        const hr = document.createElement('hr');
        locationList.appendChild(hr);
    });
}

// Call initMap on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    initMap();
});

// Fungsi untuk menambah penanda di peta berdasarkan lokasi input
function addMarker(location) {
    new google.maps.Marker({
        position: location,
        map: map,
    });
}

// Fungsi untuk mencari lokasi dan menambah penanda
// Fungsi untuk melakukan pencarian berdasarkan koordinat
async function searchByCoordinates(lat, lng) {
    const geocoder = new google.maps.Geocoder();

    try {
        const location = new google.maps.LatLng(lat, lng);
        const request = { location: location };

        const results = await new Promise((resolve, reject) => {
            geocoder.geocode(request, (results, status) => {
                if (status === 'OK') {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        });

        const address = results[0].formatted_address;
        console.log('Formatted Address:', address);

        map.setCenter(location);
        addMarker(location);

        // Hitung jarak dari lokasi pencarian ke setiap pasar
        const updatedMarkets = appVars.initialMarkers.map((market) => {
            const distance = haversineDistance({ lat, lng }, market.gps);
            return { ...market, distance };
        });

        // Update tampilan pasar berdasarkan jarak
        displayMarkets(updatedMarkets);
    } catch (error) {
        console.error('Error performing geocode request:', error);
    }
}

// Fungsi untuk mengijinkan lokasi pada web browser kita
document.querySelector('.btn-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log('Latitude:', lat, 'Longitude:', lng); // Tambahkan log ini

                if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
                    const geocoder = new google.maps.Geocoder();
                    const request = { location: { lat: lat, lng: lng } }; // Gunakan latLng alih-alih location
                    console.log('Geocoding request:', request); // Tambahkan log ini
                    geocoder.geocode(request, (results, status) => {
                        if (status === "OK" && results[0]) {
                            const userLocationName = results[0].formatted_address;
                            const userLocation = { lat, lng, name: userLocationName };

                            map.setCenter(userLocation);
                            new google.maps.Marker({
                                position: userLocation,
                                map: map,
                                title: 'Your location',
                            });

                            updateDistances(userLocation);
                        } else {
                            console.error('Geocode was not successful. Status: ' + status);
                        }
                    });
                } else {
                    console.error('Invalid latitude or longitude values.');
                }
            },
            error => {
                console.error('Error getting location: ', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
});

// Fungsi untuk memperbarui jarak marker berdasarkan lokasi pengguna
function updateDistances(userLocation) {
    // Update title H3 with user location
    const locationTitle = document.querySelector('.block-heading h3');
    locationTitle.textContent = `Christmas Markets near ${userLocation.name}`;

    // Dapatkan semua elemen marker detail
    const markerDetails = document.querySelectorAll('.markerDetail');

    markerDetails.forEach((detail, index) => {
        const lat = parseFloat(detail.getAttribute('data-lat'));
        const lng = parseFloat(detail.getAttribute('data-lng'));

        const distance = haversineDistance(userLocation, { lat: lat, lng: lng });
        const distanceString = `${distance.toFixed(2)} km`;

        // Perbarui elemen jarak
        const distanceElement = detail.querySelector('.distance');
        if (distanceElement) {
            distanceElement.textContent = `Distance: ${distanceString}`;
        }
    });
}

// Fungsi untuk menyimpan lokasi
function saveLocation() {
    const savedBtn = document.getElementById("savedBtn");
    let savedCount = parseInt(savedBtn.innerHTML.match(/\d+/)[0]);

    savedCount++;
    savedBtn.innerHTML = `<i class="bi bi-geo-alt-fill"></i> Saved (${savedCount})`;
}

// Fungsi untuk memfilter tanggal menggunakan flatpickr
function initDatepicker() {
    flatpickr("#datepicker", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates, dateStr, instance) {
            appVars.inputDate = selectedDates;
            console.log(selectedDates);
        }
    });
}

// Fungsi untuk menyimpan perubahan
function saveChanges() {
    const selectedDates = appVars.inputDate;
    if (selectedDates && selectedDates.length > 0) {
        console.log("Selected Dates: ", selectedDates);
        // Lakukan sesuatu dengan tanggal yang dipilih, seperti menyimpan ke variabel atau filter data
        filterMarketsByDate(selectedDates);
    }
}

// Fungsi untuk memfilter pasar berdasarkan tanggal
function filterMarketsByDate(dates) {
    console.log("Filtering markets by date: ", dates);
    // Implementasikan logika untuk memfilter pasar berdasarkan tanggal
}

// Memanggil fungsi saat dokumen siap
document.addEventListener("DOMContentLoaded", function () {
    initMap();
    initDatepicker();
    // Hapus atau komentar baris berikut jika tidak diperlukan
    // document.querySelector(".btn-location").addEventListener("click", searchLocation);
    document.getElementById("savedBtn").addEventListener("click", saveLocation);
});

// Mendapatkan elemen locationList dari DOM
const locationList = document.getElementById('locationList');
console.log('locationList element:', locationList);

// Penambahan dan Modifikasi Title h3 terkait lokasi user
const locationTitle = document.querySelector('.block-heading h3');
locationTitle.textContent = `Christmas Markets near ${appVars.defaultLocationName}`;

// Fungsi untuk menghasilkan URL gambar berdasarkan detail dan params
function getImageUrl(detail, params) {
    console.log('Detail:', detail);
    console.log('Params:', params);
    if (detail && detail.imageIdList && detail.imageIdList.length > 0) {
        return io_base_url + 'backend/assets/dynamic/' + detail.imageIdList[0] + '-' + params.image_size + '.jpg';
    }
    return ''; // URL default jika imageIdList tidak ada atau detail tidak terdefinisi
}

// Open Now Button
function toggleBoxes() {
    const landingBox = document.querySelector('.landing-box');
    const resultBox = document.querySelector('.result-box');

    if (landingBox && resultBox) {
        landingBox.style.display = 'none';
        resultBox.style.display = 'block';
    }
}

// Fungsi Utilitas untuk Format Tanggal, Lalu intergrasikan ke Skrip Utama fetch(markersUrl)
function formatDateRange(openingDate) {
    if (!openingDate.open || !openingDate.close) return 'Unknown';

    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };

    const openDate = new Date(openingDate.open);
    const closeDate = new Date(openingDate.close);

    const openDateString = openDate.toLocaleDateString('en-US', options);
    const closeDateString = closeDate.toLocaleDateString('en-US', options);

    return `${openDateString} - ${closeDateString}`;
}

// fungsi utilitas untuk menghitung jarak menggunakan rumus Haversine.
//! Fungsi Haversine untuk menghitung jarak antara dua titik di permukaan bumi
function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    const R = 6371; // Radius bumi dalam kilometer
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Jarak dalam kilometer

    return distance;
}

//? Tambahkan fungsi Haversine ini Kedalam Fungsi Utama