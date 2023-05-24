import { setLocationObject,
         getHomeLocation,
         getCoordsFromApi,
         getWeatherFromCoords,
         cleanText,
         } from "./dataFunction.js";
import { setPlaceHolderText,
         addSpinner,
         displayError,
         updateDisplay,
         updateScreenReaderConfirmation,
         displayApiError } from "./domFunction.js";
import CurrentLocation from "./CurrentLocation.js";
 const currentLoc = new CurrentLocation();
const initApp = ()=>{
    //add listeners 
    console.log("initapp called")
    const geoButton = document.querySelector("#getLocation");
    const homeButton = document.querySelector("#home");
    const saveButton = document.querySelector("#SaveLocation");
    const unitButton = document.querySelector("#unit");
    const refreshButton = document.querySelector("#Refresh");
    geoButton.addEventListener("click",getGeoWeather);
    homeButton.addEventListener("click",loadWeather);
    saveButton.addEventListener("click",saveLocation);
    unitButton.addEventListener("click",setUnitPref);
    refreshButton.addEventListener("click",refreshWeather);
    const locationEntry = document.getElementById("search_form");
    locationEntry.addEventListener("submit",submitNewLocation)
    // set up
    setPlaceHolderText();
    // load weather
    loadWeather();
}
document.addEventListener("DOMContentLoaded",initApp);


const getGeoWeather =(event)=>{
    if(event){
        if(event.type === "click"){
            console.log("clicked")
            const mapIcon = document.querySelector(".fa-solid.fa-location-dot.fa-bounce");
            
            addSpinner(mapIcon);

         }
     }
    if(!navigator.geolocation) return geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
 }
  const geoError = (errObj)=>{
    console.log(errObj);
    const errMsg = errObj ? errObj.message : "Geolocation not supported"
    displayError (errMsg, errMsg);
}
const geoSuccess = (position)=>{
    console.log(position)
    
    const myCoordsObj ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name:`Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    }
    //set location object
    
    setLocationObject(currentLoc,myCoordsObj);
    
    // update data and display
    updateDataAndDisplay(currentLoc);
};
const loadWeather= (event)=>{
    const savedLocation = getHomeLocation();
    if(!savedLocation&& !event) return getGeoWeather();
    if(!savedLocation&& event.type === "click"){
        displayError(
            "No Home Location Saved",
            "Sorry. Please save your home location first"
        )
    }else if(savedLocation && !event){
        displayHomeLocationWeather(savedLocation);
    }else{
        const homeIcon = document.querySelector(".fa-solid.fa-house");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }

} 
// const displayHomeLocationWeather = (home)=>{
//     if(typeof home ==="string"){
//         const locationJson = JSON.parse(home);
//         console.log(locationJson)
//         const myCoordsObj ={
//             lat: locationJson.lat,
//             lon: locationJson.lon,
//             name: locationJson.name,
//             unit: locationJson.unit
//         };
//         setLocationObject(currentLoc,myCoordsObj);
//         updateDataAndDisplay(currentLoc);
//     }
// }
const saveLocation = ()=>{
    if(currentLoc.getLat() && currentLoc.getLon()){
        const saveIcon = document.querySelector(".fa-solid.fa-floppy-disk");
        addSpinner(saveIcon);
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        };
        localStorage.setItem("defaultWeatherLocation",JSON.stringify(location));
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location`)
    }
}
const setUnitPref =()=>{
    const unitIcon = document.querySelector(".fa-solid.fa-sliders");
    addSpinner(unitIcon)
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc);
}
const refreshWeather =()=>{
    const refreshIcon = document.querySelector(".fa-solid.fa-rotate");
    addSpinner(refreshIcon);
    updateDataAndDisplay(currentLoc);
}

const submitNewLocation = async(event)=>{
    event.preventDefault();
    const text = document.getElementById("searchBar_text").value;
    const entryText = cleanText(text);
    if(!entryText.length) return;
    const locationIcon = document.querySelector(".fa-solid.fa-magnifying-glass.fa-bounce");
    addSpinner(locationIcon);
    // console.log(currentLoc)
    const coordsData = await getCoordsFromApi(entryText,currentLoc.getUnit())
    console.log(coordsData)
    if(coordsData){
     if(coordsData.cod == 200){
        //work with api data
        //success
        const myCoordsObj = {
            lat: coordsData.coord.lat,
            lon: coordsData.coord.lon,
            name: coordsData.sys.country ? `${coordsData.name},${coordsData.sys.country}`: coordsData.name
        }
        setLocationObject(currentLoc,myCoordsObj);
        updateDataAndDisplay(currentLoc)
     }else{
        displayApiError(coordsData);
     }
    }else{
        displayError("Connection Error","Connection Error");
    }  
}

const updateDataAndDisplay = async (locationObj) =>{
    // console.log(locationObj)
     const weatherJson = await getWeatherFromCoords(locationObj);
    //  const weatherJsonDaily = await getDailyWeatherFromCoords(locationObj);
    // console.log(weatherJsonDaily)
     
     if(weatherJson) updateDisplay(weatherJson,locationObj);
     
}
 







 