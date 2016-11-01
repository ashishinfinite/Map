var info = [
{title: "ahmedabad",location: {lat: 23.022505,lng: 72.571362},id: 1,index: 0},
{title: "surat",location: {lat: 21.17024,lng: 72.831061},id: 1,index: 1},
{title: "gandhinagar",location: {lat: 23.215635,lng: 72.636941},id: 1,index: 2},
{title: "vadodara",location: {lat: 22.307159,lng: 73.181219},id: 1,index: 3},
{title: "bharuch",location: {lat: 21.705136,lng: 72.995875},id: 1,index: 4},
{title: "bhavnagar",location: {lat: 21.764473,lng: 72.15193},id: 1,index: 5}, 
{title: "ankleshwar",location: {lat: 21.626424,lng: 73.015198},id: 1,index: 6}
];
var self;
var model=function(){
const self=this;

self.input_place=ko.observable("");
self.arrays=ko.observableArray([]);
info.forEach(function(item){
      self.arrays.push(new maps(item));
});
self.stringStartsWith = function (string, startsWith) {          
    string = string || "";
    if ((startsWith.length > string.length) ||(startsWith==='') )
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};
self.ashish2=ko.observableArray([]);
//console.log(self);
self.filteredItems=function(array,search){
     self.ashish2([]);
    //console.log(array);
    var searching=search.toLowerCase();
    console.log(searching);
 	for(var i=0;i<array.length;i++){
    
    	ite=self.stringStartsWith (array[i].title(),searching);
       if (ite===true){
        self.ashish2().push(array[i].title());
        }
    }
    
};

self.ashish=ko.computed(function(){
   self.filteredItems(self.arrays(),self.input_place());
   self.ashish2().forEach(function(item){
         console.log(item);
   });
    
});







// self.filtering = ko.computed(function() {
// 	 var filter = self.inputted_text().toLowerCase();
// 	      console.log(self.filteredItems(self.arrays(), function(item) {
// 	  	   //console.log(self.stringStartsWith(item.title().toLowerCase(), filter));
// 	  	   //return true;
//            return self.stringStartsWith(item.title().toLowerCase(), filter);
//         }));


// });






//console.log(self.stringStartsWith("ahmedabad","ahm"));
//console.log(ko.utils.arrayFilter("ahmedabad",'true'));
}

ko.applyBindings(new model());

function maps(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.id = ko.observable(data.id);
    this.index = ko.observable(data.index);
}