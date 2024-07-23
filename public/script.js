

const socket = io();
var mysocketid;
var firstReload = true;
socket.on('connect',()=>{
    mysocketid = socket.id
})


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position)=>{
            const {latitude,longitude} = position.coords
            socket.emit('send-location',{latitude,longitude})
        },(error)=>{
            console.log(error);
        },
    {
        enableHighAccuracy:true,
        //no caching
        maximumAge:0,
        //loc check time (5s)
        timeout:5000
    })
    }
    else console.log("geolocation is not supported by user")
}

getLocation()

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = {};
//[latitude,longitude]


socket.on('update-location',(data)=>{       
    const {id,latitude,longitude} = data;

    if(id===mysocketid && firstReload){
        map.setView([latitude, longitude],13)
        firstReload = false
        }
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        console.log("new merker added");
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
    // console.log(markers);

})

socket.on('user-disconnected',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id];
    }
    console.log("user disconnected",markers);
})

