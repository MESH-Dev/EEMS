angular.module('starter.controllers', [])

.controller('LandingCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform, $cordovaInAppBrowser, $ionicModal, $ionicPopover, $rootScope, $state) {

  // .fromTemplate() method
  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope,
  });

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  var options = {
      toolbar: 'yes',
      location: 'no',
      clearcache: 'no'
    };

    $scope.doSomething = function() {
      if ($rootScope.skipped == false) {
        $state.go('vibe');
      } else {
        $scope.scanBarcode();
      }
    }

    $scope.scanBarcode = function() {

      $ionicPlatform.ready(function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {


          if(imageData.text.length > 0) {
            $cordovaInAppBrowser.open(imageData.text, '_blank', options)
              .then(function(event) {
                // success
              })
              .catch(function(event) {
                // error
              });
          } else {
            $state.go('landing');
          }

        }, function(error) {
          console.log('an error happened: ' + error);
        });
      });

    }

})

.controller('TourCtrl', function($scope, $ionicLoading, $compile, $ionicModal, $http, $ionicGesture, $window, $interval, $stateParams, $http, $q, $ionicNavBarDelegate, $ionicViewService, $cordovaMedia, $ionicScrollDelegate) {

  $scope.first = true;

  $scope.control = function(src) {

    if (!$scope.play.state) {
      if ($scope.first) {
        $scope.media = new Media(src, null, null, mediaStatusCallback);
      }
      $scope.media.play();
    } else {
      $scope.media.pause();
    }
  }

  var mediaStatusCallback = function(status) {
      if(status == 1) {
        $ionicLoading.show({template: 'Loading...'});
      } else {
          $ionicLoading.hide();
      }
  }

  $scope.pause = function(sound) {
    sound.pause;
    $scope.isStreaming = false;
  }


  // Toggle the up and down arrows
  $scope.arrow_icon = "img/Up_Icon.png";

  $scope.toggleArrow = function() {
    if ($scope.toggle.state == true) {
      $scope.arrow_icon = "img/Down_Icon.png";

      if ($scope.tour[$scope.active]['image']) {
        $scope.imgSrc = $scope.tour[$scope.active]['image'];
      } else {
        $scope.imgSrc = "place1.jpg";
      }

    } else {
      $scope.arrow_icon = "img/Up_Icon.png";
    }
  }



  // Load the array of markers
  $scope.gmarkers = [];

  // Set the marker icons
  $scope.historicalbuilding = "img/HistoricalBuilding.png";
  $scope.historicalbuilding_active = "img/HB_Active.png";
  $scope.publicart = "img/PublicArt.png";
  $scope.publicart_active = "img/PublicArts_Active.png";

  // Set the navigation icons
  $scope.publicartsicon_vis = "img/PublicArt-small.png";
  $scope.historicalbuildingsicon_vis = "img/HistoricalBuilding-small.png";
  $scope.fulltouricon_vis = "img/FullTour-small.png";

  $scope.publicartsicon_active = 'img/PublicArts_Active-small.png';
  $scope.historicalbuildingsicon_active = "img/HB_Active-small.png";
  $scope.fulltouricon_active = "img/FullTour_Active-small.png";

  // Set the initial states of the nav icons
  $scope.publicartsicon = $scope.publicartsicon_vis;
  $scope.historicalbuildingsicon = $scope.historicalbuildingsicon_vis;
  $scope.fulltouricon = $scope.fulltouricon_vis;

  // Set the background of the navigation icons
  $scope.publicartsclass = 'public-arts';
  $scope.historicalbuildingsclass = 'historical-buildings';
  $scope.fulltourclass = 'full-tour';

  // Set whether it's the first run
  $scope.firstRun = true;

  // Initialize
  $scope.init = function() {

    // Create the map
    createMap();

    // Find where you are
    geolocatePosition();

    // Load the tour locations
    loadTours();

  }

  $scope.jumpToStop = function(tourstop) {

    // Close all previous info windows
    // $scope.infowindow.close();

    // Set the new marker to active
    tourstop.setIcon(tourstop['activeIcon']);

    $scope.map.panTo(tourstop.getPosition());

    $scope.prevMarker.setIcon($scope.prevMarker['icon']);

    // Create the new info window
    // var cString = '<div id="content"><div id="bodyContent"><p>'+tourstop['title']+'</p></div></div>';
    //
    // $scope.infowindow = new google.maps.InfoWindow({
    //   content: cString
    // });
    //
    // $scope.infowindow.open($scope.map, tourstop);

    // Set the active tour step
    $scope.active = tourstop['number'];

    // Reset the previous marker
    $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
    $scope.prevMarker = tourstop;
  }

  $scope.nextStep = function() {

    $scope.first = true;
    $scope.active = $scope.active + 1;

    if ($scope.active == ($scope.tour.length)) {
      $scope.active = 0;
    }

    if ($scope.tour[$scope.active]['image']) {
      $scope.imgSrc = $scope.tour[$scope.active]['image'];
    } else {
      $scope.imgSrc = "";
    }

    // $scope.infowindow.close();

    // Set the infowindow
    // var cString = '<div id="content"><div id="bodyContent"><p>'+$scope.tour[$scope.active]['title']+'</p></div></div>';
    // $scope.infowindow = new google.maps.InfoWindow({
    //   content: cString
    // });
    // $scope.infowindow.open($scope.map, $scope.tour[$scope.active]);

    // Change the icon of the current icon
    $scope.tour[$scope.active].setIcon($scope.tour[$scope.active]['activeIcon']);

    $scope.map.panTo($scope.tour[$scope.active].getPosition());

    if ($scope.firstStep == true) {
      $scope.tour[0].setIcon($scope.tour[$scope.active]['visIcon']);
      $scope.firstStep = false;
    } else {
      // Change the icon of the previous icon
      $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
    }

    // Set previous marker
    $scope.prevMarker = $scope.tour[$scope.active];

    if ($scope.play.state) {
      $scope.media.stop();
    }

  }

  $scope.prevStep = function() {

    $scope.first = true;
    $scope.active = $scope.active - 1;

    if ($scope.active == -1) {
      $scope.active = $scope.tour.length - 1;
    }

    if ($scope.tour[$scope.active]['image']) {
      $scope.imgSrc = $scope.tour[$scope.active]['image'];
    } else {
      $scope.imgSrc = "";
    }

    // $scope.infowindow.close();

    // Set the infowindow
    // var cString = '<div id="content"><div id="bodyContent"><p>'+$scope.tour[$scope.active]['title']+'</p></div></div>';
    // $scope.infowindow = new google.maps.InfoWindow({
    //   content: cString
    // });
    // $scope.infowindow.open($scope.map, $scope.tour[$scope.active]);

    // Change the icon of the current icon
    $scope.tour[$scope.active].setIcon($scope.tour[$scope.active]['activeIcon']);

    $scope.map.panTo($scope.tour[$scope.active].getPosition());

    if ($scope.firstStep == true) {
      $scope.tour[0].setIcon($scope.tour[$scope.active]['visIcon']);
      $scope.firstStep = false;
    } else {
      // Change the icon of the previous icon
      $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
    }

    // Set previous marker
    $scope.prevMarker = $scope.tour[$scope.active];

    if ($scope.play.state) {
      $scope.media.stop();
    }

  }

  // THIS NEEDS TO HAVE A TRY-CATCH

  var setKmlLayer = function(tourName) {

    if (tourName == 'Public Arts') {

      $scope.historicalLayer.setMap(null);
      $scope.fullLayer.setMap(null);
      $scope.publicLayer.setMap($scope.map);

    } else if (tourName == 'Historical Buildings') {

      $scope.publicLayer.setMap(null);

      $scope.fullLayer.setMap(null);
      $scope.historicalLayer.setMap($scope.map);

    } else if (tourName == 'Full Tour') {

      $scope.historicalLayer.setMap(null);
      $scope.publicLayer.setMap(null);
      $scope.fullLayer.setMap($scope.map);

    } else {
      console.log("No KML layer.")
    }

  }

  $scope.changeTour = function(tourName) {

    $scope.firstStep = true;

    if ($scope.firstRun == true) {
      $scope.firstRun = false;
    } else {
    //   $scope.infowindow.close();
      $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
    }

    if (tourName == 'Public Arts') {


      // Create a temporary tour array
      $scope.tour = [];

      // Set the title
      $scope.title = 'Public Arts';
      $scope.toplinecolor = "#ffd109";

      // Display only the Public Arts markers
      for (var i = 0; i < $scope.gmarkers.length; i++) {
        if ($scope.gmarkers[i]['tour'] != 'Public Arts') {
          $scope.gmarkers[i].setVisible(false);
        } else {
          $scope.gmarkers[i].setVisible(true);
          $scope.tour.push($scope.gmarkers[i]);
        }
      }

      // Switch the active nav icons
      resetNavIcons();

      $scope.publicartsclass = 'cover';
      $scope.publicartsicon = $scope.publicartsicon_active;


      startTour();

      // Lay down KML layer
      setKmlLayer(tourName);

    } else if (tourName == 'Historical Buildings') {

      // Create a temporary tour array
      $scope.tour = [];

      // Set the title
      $scope.title = 'Historical Buildings';
      $scope.toplinecolor = "#43a8db";

      // Display only the Historical Buildings markers
      for (var i = 0; i < $scope.gmarkers.length; i++) {
        if ($scope.gmarkers[i]['tour'] != 'Historical Buildings') {
          $scope.gmarkers[i].setVisible(false);
        } else {
          $scope.gmarkers[i].setVisible(true);
          $scope.tour.push($scope.gmarkers[i]);
        }
      }

      // Switch the nav icons
      resetNavIcons();

      $scope.historicalbuildingsclass = 'cover';
      $scope.historicalbuildingsicon = $scope.historicalbuildingsicon_active;

      startTour();

      // Lay down KML layer
      setKmlLayer(tourName);

    } else if (tourName == 'Full Tour') {

      // Create a temporary tour array
      $scope.tour = [];

      // Set the title
      $scope.title = 'Full Tour';
      $scope.toplinecolor = "#43a0ad";

      // Display only the Full Tour markers
      for (var i = 0; i < $scope.gmarkers.length; i++) {
        if ($scope.gmarkers[i]['tour'] != 'Full Tour') {
          $scope.gmarkers[i].setVisible(false);
        } else {
          $scope.gmarkers[i].setVisible(true);
          $scope.tour.push($scope.gmarkers[i]);
        }
      }

      // Switch the nav icons
      resetNavIcons();

      $scope.fulltourclass = 'cover';
      $scope.fulltouricon = $scope.fulltouricon_active;

      startTour();

      // Lay down KML layer
      setKmlLayer(tourName);

    } else {

      console.log("I don't know where you got this tour.");

    }

  }

  var resetNavIcons = function() {
    // Set the initial states of the nav icons
    $scope.publicartsicon = $scope.publicartsicon_vis;
    $scope.historicalbuildingsicon = $scope.historicalbuildingsicon_vis;
    $scope.fulltouricon = $scope.fulltouricon_vis;

    // Set the background of the navigation icons
    $scope.publicartsclass = 'public-arts';
    $scope.historicalbuildingsclass = 'historical-buildings';
    $scope.fulltourclass = 'full-tour';
  }

  var setFirstTour = function() {

    $scope.changeTour('Public Arts');

  }

  var startTour = function() {

    // Reset the active state
    $scope.active = 0;

    // Set the infowindow
    // var cString = '<div id="content"><div id="bodyContent"><p>'+$scope.tour[$scope.active]['title']+'</p></div></div>';
    // $scope.infowindow = new google.maps.InfoWindow({
    //   content: cString
    // });
    // $scope.infowindow.open($scope.map, $scope.tour[$scope.active]);

    // Change the icon of the current icon
    $scope.tour[$scope.active].setIcon($scope.tour[$scope.active]['activeIcon']);

    $scope.map.setCenter($scope.tour[$scope.active].getPosition());

    if ($scope.active > 0) {
      // Change the icon of the previous icon
      $scope.prevMarker.setIcon($scope.prevMarker['icon']);
    }

    // Set previous marker
    $scope.prevMarker = $scope.tour[$scope.active];

  }

  var loadTours = function() {

    var tourFile = 'http://charlestoneastend.com/tours.json';

    $http.get(tourFile).success(function(locs) {

      // Create some temp arrays to compare against when assigning icons to markers in the full tour
      var tempPublicArts = [];
      var tempHistoricalBuildings = [];

      for (var k = 0; k < locs.length; k++) {
        for (var i = 0; i < locs[k]['tourstops'].length; i++) {
          if (locs[k]['title'] == 'Public Arts') {
            tempPublicArts.push(locs[k]['tourstops'][i]['tour_stop']['post_title']);
          } else if (locs[k]['title'] == 'Historical Buildings') {
            tempHistoricalBuildings.push(locs[k]['tourstops'][i]['tour_stop']['post_title']);
          } else {
          }
        }
      }

      // Create markers for each tour

      // Loop through the tours
      for (var k = 0; k < locs.length; k++) {

        // Loop through the JSON file adding the markers\
        for (var i = 0; i < locs[k]['tourstops'].length; i++) {

          // Create the marker
          var icon;
          var icon_active;

          if (locs[k]['title'] == 'Public Arts') {
            icon = $scope.publicart;
            icon_active = $scope.publicart_active;
          } else if (locs[k]['title'] == 'Historical Buildings') {
            icon = $scope.historicalbuilding;
            icon_active = $scope.historicalbuilding_active;
          } else if (locs[k]['title'] == 'Full Tour'){

            // Assign icons in the full tour

            for (var a = 0; a < tempPublicArts.length; a++) {
              if (tempPublicArts[a] == locs[k]['tourstops'][i]['tour_stop']['post_title']) {
                icon = $scope.publicart;
                icon_active = $scope.publicart_active;
              }
            }

            for (var a = 0; a < tempHistoricalBuildings.length; a++) {
              if (tempHistoricalBuildings[a] == locs[k]['tourstops'][i]['tour_stop']['post_title']) {
                icon = $scope.historicalbuilding;
                icon_active = $scope.historicalbuilding_active;
              }
            }

          } else {
            console.log("We have a problem.");
          }



          marker = new google.maps.Marker({
            title: locs[k]['tourstops'][i]['tour_stop']['post_title'],
            position: new google.maps.LatLng(locs[k]['tourstops'][i]['tour_stop']['latitude'], locs[k]['tourstops'][i]['tour_stop']['longitude']),
            map: $scope.map,
            icon: icon,
            visIcon: icon,
            activeIcon: icon_active,
            tour: locs[k]['title'],
            number: locs[k]['tourstops'][i]['tour_stop']['number'],
            description: locs[k]['tourstops'][i]['tour_stop']['post_content'],
            image: locs[k]['tourstops'][i]['tour_stop']['image'],
            audio: locs[k]['tourstops'][i]['tour_stop']['audio']
          });

          marker.setIcon(marker['icon']);

          // Create the content for the info window

          var contentString = '<div id="content"><div id="bodyContent"><p>'+marker['title']+'</p></div></div>';

          // Clicking a new marker event
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

              // Close all previous info windows
            //   $scope.infowindow.close();

              // Set the new marker to active
              marker.setIcon(marker['activeIcon']);

              $scope.prevMarker.setIcon($scope.prevMarker['icon']);

              // Create the new info window
            //   var cString = '<div id="content"><div id="bodyContent"><p>'+marker['title']+'</p></div></div>';
              //
            //   $scope.infowindow = new google.maps.InfoWindow({
            //     content: cString
            //   });
              //
            //   $scope.infowindow.open($scope.map, marker);

              // Set the active tour step
              $scope.active = marker['number'];
              $scope.$apply();

              // Reset the previous marker
              $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
              $scope.prevMarker = marker;
            }
          })(marker, i));

          $scope.gmarkers.push(marker);
        }

      }

      setFirstTour();

    });

  }

  var createMap = function() {

    // Lay down the KML layer
    $scope.publicLayer = new google.maps.KmlLayer({
      url: 'http://charlestoneastend.com/public-arts-final.kml'
    });

    $scope.historicalLayer = new google.maps.KmlLayer({
      url: 'http://charlestoneastend.com/historical-buildings-final.kml'
    });

    $scope.fullLayer = new google.maps.KmlLayer({
      url: 'http://charlestoneastend.com/full-tour-final.kml'
    });

    var myLatlng = new google.maps.LatLng(38.338068,-81.626052);

    var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#ff0000"
            },
            {
                "lightness": "100"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ace5fc"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

    var mapOptions = {
      center: myLatlng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: styles
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

  var geolocatePosition = function() {

    // Try HTML5 geolocation

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

          $scope.position = pos;

          // var infowindow = new google.maps.InfoWindow({
          //   map: $scope.map,
          //   position: pos,
          //   content: 'You are here!',
          //   disableAutoPan: true
          // });

          var image = 'http://i.stack.imgur.com/orZ4x.png';
          var marker = new google.maps.Marker({
                  position: pos,
                  map: $scope.map,
                  icon: image
              });
          marker.setMap($scope.map);

          $scope.map.setCenter($scope.tour[$scope.active].getPosition());

        }, function() {
          handleNoGeolocation(true);
        });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }

  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: $scope.map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    // map.setCenter(options.position);
  }

  $scope.centerOnLocation = function() {
    $scope.map.setCenter($scope.position);
  }

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  }

  $scope.play = [{state:true}];
  $scope.toggle = [{state:true}];
  $scope.list = [{state:true}];

  // ionic.Platform.ready(initialize);

})


.controller('ExploreCtrl', function($scope, $ionicLoading, $compile, $ionicModal, $http, $ionicGesture, $window, $interval, $stateParams, $http, $q, $ionicNavBarDelegate, $ionicViewService, $location, $ionicScrollDelegate) {

  // For toggling and filtering on the front-end LOOK AT THIS LATER
  $scope.filters = [
    { 'label':'accomodations', 'title':'Accomodations'},
    { 'label':'arts-and-entertainment', 'title':'Arts and Entertainment'},
    { 'label':'dining-and-nightlife', 'title':'Dining and Nightlife'},
    { 'label':'governmental', 'title':'Governmental'},
    { 'label':'industrial', 'title':'Industrial'},
    { 'label':'non-profit-organization', 'title':'Non-Profit Organization'},
    { 'label':'professional-services', 'title':'Professional Services'},
    { 'label':'services', 'title':'Services'},
    { 'label':'shopping', 'title':'Shopping'},
    { 'label':'public-arts', 'title':'Public Arts'},
    { 'label':'historical-buildings', 'title':'Historical Buildings'},
    { 'label':'all', 'title':'All'}];
  $scope.toggleObject = {filter: -1};
  $scope.toggle = [{state:true}];

  $scope.panel_active = [{state:false}];

  // For toggling the arrow

  $scope.arrow_icon = "img/Up_Icon.png";

  $scope.toggleArrow = function() {
    if ($scope.toggle.state == true) {
      $scope.arrow_icon = "img/Down_Icon.png";
    } else {
      $scope.arrow_icon = "img/Up_Icon.png";
    }
  }

  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  }

  // Set the icons
  $scope.accomodations = 'img/Accomodations.png';
  $scope.accomodations_active = 'img/Accomodations_active.png';
  $scope.arts = 'img/Arts.png';
  $scope.arts_active = "img/Arts_active.png";
  $scope.dining = 'img/Dining.png';
  $scope.dining_active = 'img/Dining_active.png';
  $scope.governmental = 'img/Governmental.png';
  $scope.governmental_active = 'img/Governmental_active.png';
  $scope.industrial = 'img/Industrial.png';
  $scope.industrial_active = 'img/Industrial_active.png';
  $scope.nonprofit = 'img/NonProfit.png';
  $scope.nonprofit_active = 'img/NonProfit_active.png';
  $scope.professional = 'img/Professional.png';
  $scope.professional_active = 'img/Professional_Active.png';
  $scope.services = 'img/Services.png';
  $scope.services_active = 'img/Services_active.png';
  $scope.shopping = 'img/Shopping.png';
  $scope.shopping_active = 'img/Shopping_active.png';

  $scope.historicalbuilding = "img/HistoricalBuilding.png";
  $scope.historicalbuilding_active = "img/HB_Active.png";
  $scope.publicart = "img/PublicArt.png";
  $scope.publicart_active = 'img/PublicArts_Active.png';

  // To figure out if it's the first run
  $scope.firstRun = true;


  $scope.resetMarkers = function(category) {

    $scope.active = category;

    for (var i = 0; i < $scope.gmarkers.length; i++) {

    //   if (typeof $scope.infowindow != 'undefined') {
    //     $scope.infowindow.close();
    //   }

      if ($scope.gmarkers[i]['category'] == category) {
        $scope.gmarkers[i].setVisible(true);
      }

      else {
        if (category == 'all') {
          $scope.gmarkers[i].setVisible(true);
        } else {
          $scope.gmarkers[i].setVisible(false);
        }
      }
    }
  }

  function initialize() {

    // Create the map
    createMap();

    // Find where you are
    geolocatePosition();

    // Load the business locations
    loadBusinesses();

    // Load the tour locations
    loadTours();

  }

  $scope.explore = [];

  var loadBusinesses = function() {

    // Set the title
    $scope.title = "Explore";

    // Create an array of the markers
    $scope.gmarkers = [];

    // Set the JSON file
    var businessFile = 'http://charlestoneastend.com/businesses.json';

    $http.get(businessFile).success(function(locs) {

      // Loop through the JSON file adding the markers
      for (var i = 0; i < locs.length; i++) {

        var icon;
        var icon_active;

        if (locs[i]['business_category'] != false) {

          if (locs[i]['business_category'] == 'accomodations') {
            icon = $scope.accomodations;
            icon_active = $scope.accomodations_active;
          } else if (locs[i]['business_category'] == 'arts-and-entertainment') {
            icon = $scope.arts;
            icon_active = $scope.arts_active;
          } else if (locs[i]['business_category'] == 'dining-and-nightlife') {
            icon = $scope.dining;
            icon_active = $scope.dining_active;
          } else if (locs[i]['business_category'] == 'governmental') {
            icon = $scope.governmental;
            icon_active = $scope.governmental_active;
          } else if (locs[i]['business_category'] == 'industrial') {
            icon = $scope.industrial;
            icon_active = $scope.industrial_active;
          } else if (locs[i]['business_category'] == 'non-profit-organization') {
            icon = $scope.nonprofit;
            icon_active = $scope.nonprofit_active;
          } else if (locs[i]['business_category'] == 'professional-services') {
            icon = $scope.professional;
            icon_active = $scope.professional_active;
          } else if (locs[i]['business_category'] == 'services') {
            icon = $scope.services;
            icon_active = $scope.services_active;
          } else if (locs[i]['business_category'] == 'shopping') {
            icon = $scope.shopping;
            icon_active = $scope.shopping_active;
          } else {
            console.log(locs[i]['business_category']);
          }

          var title = locs[i]['title'].replace("&#8217;","'");

          // Create the marker
          marker = new google.maps.Marker({
            title: title,
            position: new google.maps.LatLng(locs[i]['coordinates'][0], locs[i]['coordinates'][1]),
            map: $scope.map,
            visIcon: icon,
            icon: icon,
            activeIcon: icon_active,
            category: locs[i]['business_category'],
            address: locs[i]['address'],
            phone: locs[i]['phone'],
            description: locs[i]['description'],
            facebook: locs[i]['facebook'],
            twitter: locs[i]['twitter'],
            website: locs[i]['website'],
            logo: locs[i]['logo']
          });

          // Clicking a new marker event
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

              // Close all previous info windows
              if ($scope.firstRun == true) {
                $scope.firstRun = false;
              } else {
                // $scope.infowindow.close();
                $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
              }

              $scope.panel_active.state=true;
              $scope.toggle.state=false;

              $scope.active_title = marker.title;
              $scope.active_description = marker.description;
              $scope.active_address = marker.address;
              $scope.active_phone = marker.phone;

              $scope.active_facebook = marker.facebook;
              $scope.active_twitter = marker.twitter;
              $scope.active_website = marker.website;

              $scope.active_logo = marker.logo;

              $scope.$apply();

              // Create the new info window
            //   var cString = '<div id="content"><div id="bodyContent"><p>'+marker['title']+'</p></div></div>';
              //
            //   $scope.infowindow = new google.maps.InfoWindow({
            //     content: cString
            //   });
              //
            //   $scope.infowindow.open($scope.map, marker);

              marker.setIcon(marker['activeIcon']);
              $scope.prevMarker = marker;
            }
          })(marker, i));


          $scope.gmarkers.push(marker);

        }

        $scope.explore.push(marker);

      }

    });
  }

  var loadTours = function() {


    var tourFile = 'http://charlestoneastend.com/tours.json';

    $http.get(tourFile).success(function(locs) {

      // Create some temp arrays to compare against when assigning icons to markers in the full tour
      var tempPublicArts = [];
      var tempHistoricalBuildings = [];

      for (var k = 0; k < locs.length; k++) {
        for (var i = 0; i < locs[k]['tourstops'].length; i++) {
          if (locs[k]['title'] == 'Public Arts') {
            tempPublicArts.push(locs[k]['tourstops'][i]['tour_stop']['post_title']);
          } else if (locs[k]['title'] == 'Historical Buildings') {
            tempHistoricalBuildings.push(locs[k]['tourstops'][i]['tour_stop']['post_title']);
          } else {
          }
        }
      }

      // Create markers for each tour

      // Loop through the tours
      for (var k = 0; k < locs.length; k++) {

        // Loop through the JSON file adding the markers\
        for (var i = 0; i < locs[k]['tourstops'].length; i++) {

          // Create the marker
          var icon;
          var icon_active;
          var category;

          if (locs[k]['title'] == 'Public Arts') {
            icon = $scope.publicart;
            icon_active = $scope.publicart_active;
            category = "public-arts";
          } else if (locs[k]['title'] == 'Historical Buildings') {
            icon = $scope.historicalbuilding;
            icon_active = $scope.historicalbuilding_active;
            category = "historical-buildings";
          } else if (locs[k]['title'] == 'Full Tour'){

            // Assign icons in the full tour

            for (var a = 0; a < tempPublicArts.length; a++) {
              if (tempPublicArts[a] == locs[k]['tourstops'][i]['tour_stop']['post_title']) {
                icon = $scope.publicart;
                icon_active = $scope.publicart_active;
                category = "public-arts";
              }
            }

            for (var a = 0; a < tempHistoricalBuildings.length; a++) {
              if (tempHistoricalBuildings[a] == locs[k]['tourstops'][i]['tour_stop']['post_title']) {
                icon = $scope.historicalbuilding;
                icon_active = $scope.historicalbuilding_active;
                category = "historical-buildings";
              }
            }

          } else {
            console.log("We have a problem.");
          }

          marker = new google.maps.Marker({
            title: locs[k]['tourstops'][i]['tour_stop']['post_title'],
            position: new google.maps.LatLng(locs[k]['tourstops'][i]['tour_stop']['latitude'], locs[k]['tourstops'][i]['tour_stop']['longitude']),
            map: $scope.map,
            icon: icon,
            visIcon: icon,
            activeIcon: icon_active,
            tour: locs[k]['title'],
            number: locs[k]['tourstops'][i]['tour_stop']['number'],
            description: locs[k]['tourstops'][i]['tour_stop']['post_content'],
            image: locs[k]['tourstops'][i]['tour_stop']['image'],
            category: category
          });

          marker.setIcon(marker['icon']);
          marker.setVisible(false);
          // Create the content for the info window

          var contentString = '<div id="content"><div id="bodyContent"><p>'+marker['title']+'</p></div></div>';

          // Clicking a new marker event
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

              // Close all previous info windows
              if ($scope.firstRun == true) {
                $scope.firstRun = false;
              } else {
                // $scope.infowindow.close();
                $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
              }

              $scope.active_title = marker.title;
              $scope.active_description = marker.description;
              $scope.$apply();

              $scope.panel_active.state = true;
              $scope.toggle.state = false;

              // Create the new info window
            //   var cString = '<div id="content"><div id="bodyContent"><p>'+marker['title']+'</p></div></div>';
              //
            //   $scope.infowindow = new google.maps.InfoWindow({
            //     content: cString
            //   });
              //
            //   $scope.infowindow.open($scope.map, marker);

              marker.setIcon(marker['activeIcon']);
              $scope.prevMarker = marker;
            }
          })(marker, i));

          $scope.gmarkers.push(marker);
        }

        $scope.explore.push(marker);

      }

    });
  };

  $scope.jumpToStop = function(tourstop) {

    // Close all previous info windows
    // $scope.infowindow.close();

    $scope.active_title = tourstop.title;
    $scope.active_description = tourstop.description;
    // $scope.$apply();
    $scope.active_address = tourstop.address;
    $scope.active_phone = tourstop.phone;

    $scope.active_facebook = tourstop.facebook;
    $scope.active_twitter = tourstop.twitter;
    $scope.active_website = tourstop.website;

    $scope.panel_active.state=true;
    $scope.toggle.state = false;

    // Set the new marker to active
    tourstop.setIcon(tourstop['activeIcon']);

    $scope.map.panTo(tourstop.getPosition());

    if ($scope.firstRun == true) {
      $scope.firstRun = false;
    } else {
      $scope.prevMarker.setIcon($scope.prevMarker['visIcon']);
    }

    // Create the new info window
    // var cString = '<div id="content"><div id="bodyContent"><p>'+tourstop['title']+'</p></div></div>';
    //
    // $scope.infowindow = new google.maps.InfoWindow({
    //   content: cString
    // });
    //
    // $scope.infowindow.open($scope.map, tourstop);

    // Set the active tour step
    // $scope.active = tourstop['number'];

    // Reset the previous marker

    $scope.prevMarker = tourstop;
  }

  var createMap = function() {
    $scope.myLatlng = new google.maps.LatLng(38.3436876,-81.6229837);

    var mapOptions = {
      center: $scope.myLatlng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }

  var geolocatePosition = function() {

    // Try HTML5 geolocation

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

          $scope.position = pos;

          var image = 'http://i.stack.imgur.com/orZ4x.png';
          var marker = new google.maps.Marker({
                  position: pos,
                  map: $scope.map,
                  icon: image
              });
          marker.setMap($scope.map);

          $scope.map.setCenter($scope.myLatlng);

        }, function() {
          handleNoGeolocation(true);
        });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }



    // $scope.map.setCenter($scope.centerMap.getPosition());

  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: $scope.map,
      position: new google.maps.LatLng(60, 105),
      content: content,
      disableAutoPan: true
    };

    var infowindow = new google.maps.InfoWindow(options);
    // map.setCenter(options.position);
  }

  $scope.centerOnLocation = function() {
    $scope.map.setCenter($scope.position);
  }

  $scope.list = [{state:true}];

  ionic.Platform.ready(initialize);

})

.controller('VibeCtrl', function($scope, $state, $cordovaBarcodeScanner, $ionicPlatform, $cordovaInAppBrowser, $ionicModal, $ionicPopover, $rootScope) {

  // Called to navigate to the main app
  var startApp = function() {
    console.log('Start the barcode scanner');

    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
  };

  //No this is silly
  // Check if the user already did the tutorial and skip it if so
  if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    startApp();
  }
  else{

  }


  // Move to the next slide
  $scope.next = function() {
    $scope.$broadcast('slideBox.nextSlide');
  };

  // Our initial right buttons
  var rightButtons = [
    {
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Go to the next slide on tap
        $scope.next();
      }
    }
  ];

  // Our initial left buttons
  var leftButtons = [
    {
      content: 'Skip',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Start the app on tap
        startApp();
      }
    }
  ];

  // Bind the left and right buttons to the scope
  $scope.leftButtons = leftButtons;
  $scope.rightButtons = rightButtons;


  // Called each time the slide changes
  $scope.slideChanged = function(index) {

    // Check if we should update the left buttons
    if(index > 0) {
      // If this is not the first slide, give it a back button
      $scope.leftButtons = [
        {
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function(e) {
            // Move to the previous slide
            $scope.$broadcast('slideBox.prevSlide');
          }
        }
      ];
    } else {
      // This is the first slide, use the default left buttons
      $scope.leftButtons = leftButtons;
    }

    // If this is the last slide, set the right button to
    // move to the app
    if(index == 2) {
      $scope.rightButtons = [
        {
          content: 'Start using MyApp',
          type: 'button-positive button-clear',
          tap: function(e) {
            startApp();
          }
        }
      ];
    } else {
      // Otherwise, use the default buttons
      $scope.rightButtons = rightButtons;
    }
  };

  $scope.returnHome = function() {
    $rootScope.skipped = true;

    $state.go('landing');
  }

  $scope.scanBarcode = function() {

    $rootScope.skipped = true;

    $ionicPlatform.ready(function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {


        if(imageData.text.length > 0) {
          $cordovaInAppBrowser.open(imageData.text, '_blank', options)
            .then(function(event) {
              // success
            })
            .catch(function(event) {
              // error
            });
        } else {
          $state.go('landing');
        }

      }, function(error) {
        console.log('an error happened: ' + error);
      });
    });

  }


})
