<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/bootstrap-icons/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" href="assets/css/style.css">

    <title>Christmas Markets in Europe 2023 / 2024 | TUI</title>
</head>

<body>

    <div class="io-content">

        <!-- Sisipkan div untuk menampilkan peta -->
        <div id="map" style="height: 680px; width: 100%;">
        </div>
        <!-- Map End -->

        <div class="container-fluid floating-box mt-4">
            <div class="control-box block-box">
                <div class="search-input-group d-flex mb-2">
                    <span class="input-group me-3">
                        <input type="text" class="form-control" placeholder="Click the target or type a location"">
                                <button class=" btn btn-location"><i class="bi bi-crosshair"></i></button>
                    </span>
                    <button class="btn btn-saved" id="savedBtn"><i class="bi bi-geo-alt-fill"></i> Saved (0) </button>
                </div>
                <div class="filters">
                    <button class="btn" onclick="toggleBoxes()">Open Now</button>
                    <!-- <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#filterModal">Filter Date</button> -->
                    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#filterModal" id="filterButton">Filter Date</button>
                    <button class="btn" onclick="resetMap()">Reset Map</button>
                </div>
            </div>
            <!-- CONTROL BOX SECTION -->

            <div class="landing-box block-box">
                <div class="box-content">
                    <h2>Christmas Markets in Europe</h2>
                    <p>An interactive European map showcasing the most enchanting Christmas markets.</p>
                    <p>Plan your festive journey - virtually or in person.</p>
                    <p>Pick your favourite markets and enter a city to explore the Yuletide wonders nearby - all from the comfort of your home! Check out the magical stalls of Nuremberg, wander the twinkling pathways of Strasbourg, or delve into the festive delights of Vienna's Christkindlmarkt.</p>

                    <div class="note">
                        <p>Please note that this page should only be used as a guidance as Christmas market opening times may be subject to change during the festive season. We advise that you check the individual market's official website or contact the organisers directly for the most up-to-date timings.</p>
                    </div>
                </div>

            </div>
            <!-- LANDING BOX SECTION END-->

            <div class="result-box block-box">
                <div class="box-header">
                    <h3 class="heading" id="result-heading">View Christmas Market locations list</h3>
                    <div class="box-action">
                        <a class="box-toggle">▼</a>
                    </div>
                </div>

                <div id="back-row">
                    <button class="btn btn-sm">« Back to more locations</button>
                </div>

                <div id="markerDetails" class="box-content">
                    <div class="block-heading">
                        <h3>Christmas Markets near London, UK</h3>
                    </div>

                    <div class="block-list location-list" id="locationList">
                        <!-- Locations will be populated here -->
                    </div>

                </div>

            </div>
            <!-- RESULT BOX SECTION END-->

        </div>

    </div>

    <!-- MODAL -->
    <div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Date</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div id="sandbox-container">
                        <div class="input-group date">
                            <input type="text" class="form-control" id="datepicker"><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveChanges()">Save changes</button>
                </div>
            </div>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="node_modules/@popperjs/core/dist/umd/popper.min.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <!-- Sisipkan script Google Maps API -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAo6oq92figYRhKvO7jz4GKPIvJVncWkZY&callback=initMap&v=beta" defer></script>
    <script src="./assets/js/script.js"></script>
</body>

</html>