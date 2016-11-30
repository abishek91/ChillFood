/*
 * recipe.js - Handle requests to the /api/recipe
 */
import querystring from 'querystring'
import {get, post} from './api.jsx'

//LOCATION TEMPORARILY HERE
function getLocation() {
  let p = Promise.resolve(null)
  
  if (navigator.geolocation) {
    p = new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (position){        
        resolve(position.coords);
      },function (error) {        
        resolve(null);
      });
    });  
  } 

  return p;
}
//LOCATION TEMPORARILY HERE



export default class Recipe {

  get(query, userId, sort_id, categories, cuisines, equipments,hasVideo, ingredients) {
    const self = this;    
    let lat = 0;
    let lon = 0;
    if (!categories)
        categories = []
    if (!cuisines)
        cuisines = []
    if (!equipments)
        equipments = []
    if (!ingredients)
        ingredients = []
    if (!sort_id)
        sort_id = 0

    let promise = getLocation()
    .then(function(coords) {
      if (coords) {
        lat = coords.latitude;
        lon = coords.longitude;
      }
      return self.connect('/api/recipes?' +
     querystring.stringify({search: query, 
                            user_id: userId,
                            sort_by: sort_id,
                            category: categories,
                            cuisine: cuisines,
                            equipment: equipments,
                            ingredient: ingredients,
                            has_video: hasVideo,
                            location_lat: lat,
                            location_lon: lon,
                        }));
    })

    return promise;
  }

  connect(url){
    let self = this;

    return get(url)
    .then(function(data) { 
      self.next = data.next;
      return data.data;
    })
    
  }

  getMore() {
    return get(this.next);
  }
}