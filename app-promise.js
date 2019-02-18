const yargs = require('yargs');
const axios = require('axios');

var argv = yargs.options({
  a: {
    demand:true,
    alias: 'address',
    desciption: 'Address to fetch weather:',
    string: true
  },

}).help().alias('help','h').argv;

console.log(argv);

var encodedAddress = encodeURIComponent(argv.address);
var geoCodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=YxNsBGVpLnos6ZWi254Jvv2aJZq7f7h6&location=${encodedAddress}`;

axios.get(geoCodeUrl).then((response)=>{
  if(response.data.status === 'ZERO_RESULTS'){
    throw new Error('Unable to find that address');
  }

  var lat = response.data.results[0].locations[0].displayLatLng.lat;
  var long = response.data.results[0].locations[0].displayLatLng.lng;
  var weatherUrl = `https://api.darksky.net/forecast/e24ede63d60de29659907c847a83a633/${lat},${long}`
  console.log(response.data.results[0].providedLocation.location);
  return axios.get(weatherUrl);
}).then((response)=>{
  var temperature = ((response.data.currently.temperature - 32) * 5/9).toFixed(2);
  var apparentTemperature= ((response.data.currently.apparentTemperature - 32) * 5/9).toFixed(2);
  console.log(`Its currently ${temperature} and feels like ${apparentTemperature}`);

}).catch((error)=>
{
  if(error.code === 'ENOTFOUND')
  {console.log('Unable to connect to API servers')}
  else{
    console.log(error.message);
  }
}
);
