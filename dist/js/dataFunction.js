
export const setLocationObject = (locationObj,coordsObj)=>{
    
    const { lat, lon ,name , unit }= coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if(unit){
        locationObj.setUnit(unit);
    }

};
export const getHomeLocation =()=>{
    return localStorage.getItem("defaultWeatherLocation")
}
export const getWeatherFromCoords = async(locationObj)=>{
    // const lat = locationObj.getLat();
    // const lon = locationObj.getLon();
    // const units = locationObj.getUnit();
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alert&units=${units}&appid=${WEATHER_API_KEY}`;
    // try{
    //     const weatherStream = await fetch(url);
    //     const weatherJson = await weatherStream.json();
    //     console.log(weatherJson)
    //     return weatherJson;
    // }catch(err){
    //     console.log(err)
    // }
    const urlDataObj = {    
     lat : locationObj.getLat(),
     lon : locationObj.getLon(),
     units : locationObj.getUnit()
    };
    try {
        const weatherStream = await fetch('./.netlify/functions/get_weather',{
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const weatherJson = await weatherStream.json();
        console.log(weatherJson)
        return weatherJson;
    }catch(err){
        console.log(err);
    }
};

export const getCoordsFromApi = async(entryText,units)=>{
    
    // const regex = /^\d+$/g;
    // const flag = regex.test(entryText) ? "zip" : "q";
    // const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
    // const encodeUrl = encodeURI(url);
    
    // try{
    //     const dataStream = await fetch(encodeUrl);
    //     const jsonData = await dataStream.json();
    //     // console.log(jsonData);
    //     return jsonData;

    // }catch(err){
    //     console.log(err.stack);
    // }
    const urlDataObj = {
        text : entryText,
        units : units
    };
    try{
        const dataStream = await fetch("./.netlify/functions/get_coords",{
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const jsonData = await dataStream.json();
        console.log(jsonData)
        return jsonData;
        }catch(err){
             console.error(err)
        }
};
export const cleanText = (text)=>{
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex," ").trim();
    console.log(entryText)
    return entryText
}

// export const getDailyWeatherFromCoords = async(locationObj)=>{
//     const lat = locationObj.getLat();
//     const lon = locationObj.getLon();
//     const units = locationObj.getUnit();
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
//     try{
//         const weatherStream = await fetch(url);
//         const weatherJsonDaily = await weatherStream.json();
//         // console.log(weatherJsonDaily);
//         return weatherJsonDaily;
//     }catch(err){
//         console.log(err)
//     }
// };