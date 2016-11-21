/*
 * recipe.js - Handle requests to the /api/recipe
 */
var querystring = require('querystring')

const url = '/api/recipes'

export default class Recipe {

  get(query, userId, sort_id, categories, cuisines, equipments,hasVideo) {
    self = this;
    
    if (!categories)
        categories = []
    if (!cuisines)
        cuisines = []
    if (!equipments)
        equipments = []
    if (!sort_id)
        sort_id = 0
    return this.connect(url + '?' +
     querystring.stringify({search: query, 
                            user_id: userId,
                            sort_by: sort_id,
                            category: categories,
                            cuisine: cuisines,
                            equipment: equipments,
                            has_video: hasVideo,
                        }));
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