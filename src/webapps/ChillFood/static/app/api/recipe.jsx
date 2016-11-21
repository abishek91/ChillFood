/*
 * recipe.js - Handle requests to the /api/recipe
 */
var querystring = require('querystring')

const url = '/api/recipes'


//LOCATION TEMPORARILY HERE
function getLocation() {
  let p = Promise.resolve(null)
  
  if (navigator.geolocation) {
    p = new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (position){
        console.log('inside',position)
        resolve(position.coords);
      },function (error) {
        console.log(error);
        resolve(null);
      });
    });  
  } 

  return p;
}
//LOCATION TEMPORARILY HERE



export default class Recipe {

  get(query, userId, sort_id, categories, cuisines, equipments,hasVideo) {
    const self = this;
    console.log('this.props.params.',userId)
    let lat = 0;
    let lon = 0;
    if (!categories)
        categories = []
    if (!cuisines)
        cuisines = []
    if (!equipments)
        equipments = []
    if (!sort_id)
        sort_id = 0

    let promise = getLocation()
    .then(function(coords) {
      if (coords) {
        lat = coords.latitude;
        lon = coords.longitude;
      }
      return self.connect(url + '?' +
     querystring.stringify({search: query, 
                            user_id: userId,
                            sort_by: sort_id,
                            category: categories,
                            cuisine: cuisines,
                            equipment: equipments,
                            has_video: hasVideo,
                            location_lat: lat,
                            location_lon: lon,
                        }));
    })

    return promise;
  }

  connect(url){
    let self = this;

    var promise = new Promise(function (resolve,reject) {
      fetch(url, {  
        credentials: 'include',
        method: 'GET',  
        headers: {  
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-CSRFToken": getCookie('csrftoken')
        }
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        
        return response.text();
      })
      .then(function(text) { 
        var data = JSON.parse(text);
        self.next = data.next;
        // console.log('data Obtained',data);
        resolve(data.data);
      })
      .catch(function(error) {
        Materialize.toast('There has been a problem, please contact your administrator.');
        console.log('There has been a problem with your fetch operation: ' + error.message,400);
        reject(error);
      });
    })

    return promise;
  }

  getMore() {
    return this.connect(this.next);
  }
}