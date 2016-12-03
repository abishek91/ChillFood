const get = (url) => {
  let self = this;
  let response;

  var promise = new Promise(function (resolve,reject) {
    fetch(url, {  
      credentials: 'include',
      method: 'GET',  
      headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRFToken": getCookie('csrftoken')
      }
    })
    .then(function(_response) {
      response = _response
      return response.text();
    })
    .then(function(text) {     
      if (response.status == 302) {
        window.location.href="/login";
        return;
      } else if (response.status == 406) {
        var errors = JSON.parse(text);
        for (var key in errors) {
          Materialize.toast(key+": "+errors[key],2000,'orange')
        }
        
        reject(errors);
      } else if (!response.ok) {
          throw Error(response.statusText);
      } else {      
        var data = JSON.parse(text);
        resolve(data);
      }
    })
    .catch(function(error) {
      Materialize.toast('There has been a problem, please contact your administrator.',2000);
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
    })
    .catch(function(error) {
      reject(error);
    });
  })

  return promise;
}

const post = (url, body) =>{
  let response;
  
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
    .then(function(_response) {
      response = _response
      
      if (response.status == 302) {
        window.location.href="/login";
        return;
      }
      
      return response.text();
    })
    .then(function(text) {     
      if (response.status == 302) {
        window.location.href="/login";
        return;
      } if (response.status == 406) {
        var errors = JSON.parse(text);
        for (var key in errors) {
          Materialize.toast(key+": "+errors[key],2000,'orange')
        }
        
        reject(errors);
      } else if (!response.ok) {
          throw Error(response.statusText);
      } else {      
        var data = JSON.parse(text);
        resolve(data);
      }
    })
    .catch(function(error) {
      Materialize.toast('There has been a problem, please contact your administrator.',2000);
      console.log('There has been a problem with your fetch operation: ' + error.message,400);
      reject(error);
    });
  });

  return promise;
}
export {get, get2, post};