
function initMap() {
   
    var russia = { lat: 3.51602, lng: -2.1969 };
    
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 20, center: russia });
   
    var marker = new google.maps.Marker({ position: russia, map: map });
}



var MenuItems = document.getElementById("menu-items");

MenuItems.style.maxHeight = "0px";

function menutoggle(){
    if(MenuItems.style.maxHeight == "0"){
        MenuItems.style.maxHeight = "200px";
    } else {
        MenuItems.style.maxHeight = "0px";
    }
}
