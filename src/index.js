const expectExport = require("expect");
const fetch = require("node-fetch");
function BrightestStar(){
  const BOSTON = { latitude: 42.36, longitude: -71.05};
  const LONDON = { latitude: 51.51, longitude: -0.12};
  const NCR = {latitude: 28.58, longitude: 77.31};
 const SANFRANCISCO ={latitude: 37.79, longitude: -122.40};

  this.init= function(){
    try{
      fetch('https://ssd-api.jpl.nasa.gov/fireball.api?date-min=2017-01-01&req-loc=true&limit=4').then(response => {
        return response.json();
      }).then(response => this.mapToSignedCoordinateList(response)).then(list => {
        const brightestStar = this.filterListFindBrightestStar(list);
        console.log("Nasa Nasa on the Earth who's the Brightest Star of them all!!! \n\n Star with latitude", brightestStar.lat, " and longitude ", brightestStar.lon, " is the brightest of them all!!! \n Energy that is high as ", brightestStar.energy, " joules");
      });
    }
    catch(ex){
      console.error(ex);
    }
    }
  this.mapToSignedCoordinateList= function(response={field:[],data:[]}){
    const {fields,data}= response;
    let latIndex = fields.indexOf('lat');
    let latDirIndex = fields.indexOf('lat-dir');
    let lonIndex = fields.indexOf('lon');
    let lonDirIndex = fields.indexOf('lon-dir');
    let signedCoordinatesEnergyList =[];
    
      data.forEach(coordinateDetails=>{
      signedCoordinatesEnergyList.push(this.convertToSignedCoordinates(coordinateDetails, latDirIndex, latIndex, lonDirIndex, lonIndex));
      }); 
    
    return signedCoordinatesEnergyList;
  }
    this.filterListFindBrightestStar= function(list){
      let brightestStars=[];
      this.addBrightestStarForOneLocation(brightestStars,this.filterCoordinatesInRangeAndMaxEnergyStar(list,this.fireball( BOSTON.latitude,BOSTON.longitude)));
      this.addBrightestStarForOneLocation(brightestStars,this.filterCoordinatesInRangeAndMaxEnergyStar(list,this.fireball( LONDON.latitude,LONDON.longitude)))
      this.addBrightestStarForOneLocation(brightestStars,this.filterCoordinatesInRangeAndMaxEnergyStar(list,this.fireball( NCR.latitude,NCR.longitude)));
      this.addBrightestStarForOneLocation(brightestStars,this.filterCoordinatesInRangeAndMaxEnergyStar(list,this.fireball( SANFRANCISCO.latitude,SANFRANCISCO.longitude)));
    
      return brightestStars.sort((a,b)=>b.energy-a.energy).shift();
    }
    this.addBrightestStarForOneLocation= function(inputArray,fn){
      inputArray.push(fn);
    }
    this.mathAbs= function(value){
      return Math.abs(value);
    }
    this.fireball= function( lat,lon){
      const minLat=   this.mathAbs(lat)-15;
      const maxLat =  this.mathAbs(lat)+15;
      const minLon =  this.mathAbs(lon)-15;
      const maxLon =  this.mathAbs(lon)+15;    
      const latRange = lat>0?{min:minLat,max:maxLat}:{min:-minLat,max:maxLat};
      const lonRange = lon>0?{min:minLon,max:maxLon}:{min:-minLon,max:-maxLon}
      return {latRange,lonRange};
    }
    
    this.convertToSignedCoordinates=function(coordinateDetails, latDirIndex, latIndex, lonDirIndex, lonIndex) {
      let mapedPosition = {};
    
      if (coordinateDetails[latDirIndex] === 'S')
        mapedPosition.lat = -coordinateDetails[latIndex];
    
      if (coordinateDetails[latDirIndex] === 'N')
        mapedPosition.lat = coordinateDetails[latIndex];
    
      if (coordinateDetails[lonDirIndex] === 'W')
        mapedPosition.lon = -coordinateDetails[lonIndex];
    
      if (coordinateDetails[lonDirIndex] === 'E')
        mapedPosition.lon = coordinateDetails[lonIndex];
    
    
      mapedPosition.energy = coordinateDetails[lonIndex];
      return mapedPosition;
    }
    
  this.filterCoordinatesInRangeAndMaxEnergyStar= function(list,latlonRange){
      let inRangeCoordinatesList= [];
      let brightestStarForOneCoordinate;
      list.map(locationAndEnergy=>{
        if((locationAndEnergy.lat >= latlonRange.latRange.min && locationAndEnergy.lat <= latlonRange.latRange.max) ||
          (locationAndEnergy.lon >= latlonRange.lonRange.min && locationAndEnergy.lon <= latlonRange.lonRange.max)
        )
          inRangeCoordinatesList.push(locationAndEnergy);
      })
         if(inRangeCoordinatesList.length)
           brightestStarForOneCoordinate = inRangeCoordinatesList.sort((a,b)=>b.energy - a.energy).shift();
         return brightestStarForOneCoordinate;
    }
};
const brightestStarInstance= new BrightestStar();
brightestStarInstance.init();
module.exports={BrightestStar};
