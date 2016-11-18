import React from 'react';

export default class Category extends React.Component {
  render() {
     if(!this.props.user)
      return null;
    var user = this.props.user;
    var userProfileImageUrl = '/profile_image/' + userId;
    var bioSection = null;
    if(user.bio)
    {
      bioSection = <div className="chip">
                      <i className="material-icons">perm_identity</i>
                     {user.bio}
                   </div>
    }
    return (
      <div className="row">
        <div className="m12">
              <img className="user_photo big left z-depth-1 frame" src={userProfileImageUrl} />
          <h1>
            {user.name}
          </h1>    
          {bioSection}
        </div>   
      </div> 
    );
  }
}