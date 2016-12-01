const get = (url) => {
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
      resolve(data);
    })
    .catch(function(error) {
      Materialize.toast('There has been a problem, please contact your administrator.');
      console.log('There has been a problem with your fetch operation: ' + error.message,400);
      reject(error);
    });
  })

  return promise;
}

const get2 = (url) => {
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
      resolve(response);
      // resolve(data);
    })
    .catch(function(error) {
      reject(error);
    });
  })

  return promise;
}

const post = (url, body) =>{
  var promise = new Promise(function (resolve,reject) {
    fetch(url, {  
      credentials: 'include',
      method: 'POST',  
      headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRFToken": getCookie('csrftoken')
      },
      body: JSON.stringify(body)
    })
    .then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      
      return response.text();
    })
    .then(function(text) { 
      var data = JSON.parse(text);
      resolve(data);
    })
    .catch(function(error) {
      Materialize.toast('There has been a problem, please contact your administrator.');
      console.log('There has been a problem with your fetch operation: ' + error.message,400);
      reject(error);
    });
  });

  return promise;
}
export {get, get2, post};