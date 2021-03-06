function getSignedRequest(file,callback){
  var xhr = new XMLHttpRequest();

  //Make each filename unique
  filename = (new Date() - 1) + file.name;

  xhr.open("GET", "/sign_s3?file_name="+filename+"&file_type="+file.type);
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        var response = JSON.parse(xhr.responseText);
        uploadFile(file, response.data, response.url, callback);
      }
      else{
        alert("Could not get signed URL.");
      }
    }
  };
  xhr.send();
}

function uploadFile(file, s3Data, url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", s3Data.url);

  var postData = new FormData();
  for(key in s3Data.fields){
    
    console.log(key, s3Data.fields[key])

    postData.append(key, s3Data.fields[key]);
  }

  postData.append('file', file);

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
        callback(url)
   }
  };
  xhr.send(postData);
}
