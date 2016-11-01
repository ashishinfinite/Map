// In the info id describes markers visibility state by default it is 1 means all markers are visible when 
// it is zero that  marker will be hided 
// Index describe its position number in list  this is usefull in further programming for selection of location
// through programming.
// locations are city location. Title is city name.
var info = [
{title: "ahmedabad",location: {lat: 23.022505,lng: 72.571362},id: 1,index: 0},
{title: "surat",location: {lat: 21.17024,lng: 72.831061},id: 1,index: 1},
{title: "gandhinagar",location: {lat: 23.215635,lng: 72.636941},id: 1,index: 2},
{title: "vadodara",location: {lat: 22.307159,lng: 73.181219},id: 1,index: 3},
{title: "bharuch",location: {lat: 21.705136,lng: 72.995875},id: 1,index: 4},
{title: "bhavnagar",location: {lat: 21.764473,lng: 72.15193},id: 1,index: 5}, 
{title: "ankleshwar",location: {lat: 21.626424,lng: 73.015198},id: 1,index: 6}
];
var bounds;
var $nytHeaderElem = $('#nytimes-header');    // this is used for newyork times article header element. 
var $nytElem = $('#nytimes-articles');        
var largeInfowindow;

// styles is used for styling the map
var styles = [  {elementType: 'geometry',stylers: [{color: '#242f3e'}]}, 
                {elementType: 'labels.text.stroke',stylers: [{color: '#242f3e'}]}, 
                {elementType: 'labels.text.fill',stylers: [{color: '#746855'}]},
                {featureType:'road',elementType:'geometry',stylers:[{color:'#38414e'}]},
                {featureType:'road',elementType:'geometry.stroke',stylers:[{color:'#212a37'}]},
                {featureType:'road',elementType:'labels.text.fill',stylers:[{color:'#9ca5b3'}]},
                {featureType:'road.highway',elementType:'geometry',stylers:[{color:'#746855'}]},
                {featureType:'road.highway',elementType:'geometry.stroke',stylers:[{color:'#1f2835'}]},
                {featureType:'road.highway',elementType:'labels.text.fill',stylers:[{color:'#f3d19c'}]},
                {featureType:'transit',elementType:'geometry',stylers:[{color:'#2f3948'}]},
                {featureType:'water',elementType:'geometry',stylers:[{color:'#17263c'}]},
                {featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#515c6d'}]},
                {featureType:'water',elementType:'labels.text.stroke',stylers:[{color:'#17263c'}]}
             ];



var markers = [];
var map;

var model = function() {

        var self = this;
        self.ww=ko.observable(0);
        self.ww1=ko.observable(0);
        self.top_nav_heading = "GUJARAT LOCATIONS";
        self.placeArray = ko.observableArray([]);  // this will bw the array of objects of places withtheir data contained in info array at the top
        info.forEach(function(infos) {
            self.placeArray().push(new maps(infos));
        });
         


        // this is used for closing and opening of the list section of places by hemberger icon it is called through data-bind in html
        self.close = function() {            
            if(self.ww1()===0){
                self.ww1(1);
            }
            else if(self.ww1()!==0){
                self.ww1(0);
            }
         };

        
        // this is used for closing and opening of the article section of news regarding selected place by hemberger icon it is called through data-bind in html
        self.close2 = function() {
             if(self.ww()===0){
             self.ww(1);
         }
             else if(self.ww()!==0){
             self.ww(0);
         }
         
            };
            
        // This function is used for handling list items clicking.Whenever thelist item is clicked it will call ny-times side to show aticles related to 
        // that place 

        self.mask = function(obj) {   
           
            // this is used for nytimes
            var nytimesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + obj.title() + '&sort=newest&api-key=8af86f8919484763b710244cc768bcd1';
            $.getJSON(nytimesURL, function(data) {

                $nytHeaderElem.text('NEW YORK TIMES ARTICLE' + " " + obj.title());
                articles = data.response.docs;
                for (var i = 0; i < articles.length; i++) {
                    var article = articles[i];
                    $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
                }
            }).error(function(e) {       // this used for error handling if ny times is not loaded
                $nytHeaderElem.text('NEW YORK TIMES ARTICLE CANNOT BE LOADED');
            });
            populateInfoWindow(markers[obj.index()],markers, largeInfowindow); // it will call this function when place in the list  section clicked and diaplays the marker for that
            self.close2();                           // this will simulate the click action as if was clicked on marker but in reality the clicking was done on the place in the place list                 
         };

        self.input_place = ko.observable("");          // this variable moniters input provided by the user in the filter textbox
        
        //1
        self.stringStartsWith = function (string, startsWith) {    //filterin subset function      
            string = string || "";
            if ((startsWith.length > string.length) ||(startsWith==='') )
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        };
        //2
        self.filteredItems=function(array,search){          /// thhis upper 
     
            self.ashish2([]);
            var searching=search.toLowerCase();
            console.log(searching);
            for(var i=0;i<array.length;i++){
            
                ite=self.stringStartsWith (array[i].title(),searching);
               if (ite===true){
                console.log(array[i].title());
                return array[i].title();
                }
            }
        };
        //3
        self.ashish=ko.computed(function(){
            return self.filteredItems(self.placeArray(),self.input_place());
        });
        




        self.validation = ko.computed(function() {     // this function handels filter search functionality          
           
            self.placeArray().forEach(function(obj, i) {

                if ((obj.title() ===self.ashish() ) || self.input_place() === '') {  // when there the inputted placename is matched with any of the place in the list
                  // or when the filter search box is empty  make marker visible. by seting there id's to 1.                         
                       
                       obj.id(1);

                } else if ((obj.title() !== self.ashish()) && self.input_place() !== '') { //when the inputted placename dosen't match with any and the 
                  // filter search box is non empty then make the markers visible .by setting there id's to 0.
                        obj.id(0);
                }
                jesse1(obj);  // this function is actually makes marker hide ,obj is boject that contains place related data and as well as id and index 
                jesse(obj);   // this function is actually makes marker show,obj is boject that contains place related data and as well as id and index
            });
        });
    }; // end of models

// map loading javascript file
// this is the callback function called when map is requested by google map api to display,style the map.

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 23.022505,
            lng: 72.571362
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false

    });

    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();  // makes the map focus in the  area of markers 
  
    for (var i = 0; i < info.length; i++) {                   
        var marker = new google.maps.Marker({
            map: map,
            position: info[i].location,
            title: info[i].title,
            id: i,
            index:info[i].index,
            animation: google.maps.Animation.DROP,    // marker animation
        });
        markers.push(marker);
        marker.addListener('click', function() {       // whenever the marker is clicked the function is called
            populateInfoWindow(this, markers,largeInfowindow); // this will display the info window. Onn the marker
        });
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);

}





function jesse1(ash) {             // it makes marker  hide

    for (var i = 0; i < markers.length; i++) {
        if (ash.id() === 0) {     // searches object with id=0. if so,then it hides marker
            markers[ash.index()].setMap(null);
            bounds.extend(markers[i].position);
            map.fitBounds(bounds);
        }
    }
}



function jesse(ash) {              // it makes marker visible
    for (var i = 0; i < markers.length; i++) {
        if (ash.id() === 1) {       // searches object with id=1. if so,then it displays marker
            markers[ash.index()].setMap(map);
        }
    }
}





function populateInfoWindow(marker,markers, infowindow) {

    for (var i = 0; i < markers.length; i++) {
           markers[i].setAnimation(null);
        }
    
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div style="color:black">' + 'coordinates :' + marker.position + '</div>'); //contend of the info window onn the marker
        infowindow.open(map, marker);

        if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            infowindow.addListener('closeclick', function() {
            infowindow.marker = null;

            });
    }
}

ko.applyBindings(new model());
// this is used for map-error handling function
function ashish() {
    document.querySelector("#map").innerHTML = "<div class='ee'>FAILED TO FETCH MAP RESOURCE</div>";
}

// it is the constructor for making  place objects and makes every content observables so that whenever it is changed gui is also changed.
function maps(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.id = ko.observable(data.id);
    this.index = ko.observable(data.index);
}