import React from 'react';
import { Button, Card, Row, Col } from 'react-materialize';

export default class Category extends React.Component {


  render() {
     if(!this.props.profile)
      return null;
    var profile = this.props.profile;
    var userProfileImageUrl = '/profile_image/' + profile.id;
    var followerUrl = '/#/profile/' + profile.id + '/followers';
    var followingUrl = '/#/profile/' +profile.id + '/following';
    var bioSection = null;
    if(profile.bio)
    {
      bioSection = <div className="chip">
                      <i className="material-icons">perm_identity</i>
                     {profile.bio}
                   </div>
    }
      var followLink = '/follow/' + profile.id;
      var unfollowLink = '/unfollow/' + profile.id;
      var followerRows = [];
      var followers, following;
      var followingRows = [];
      var isFollowing = false;
      var redirect = function(profileLink) {
          window.location.href = profileLink
          location.reload()
      }
      var myProfile = false;
      if(profile.id == userId)
        myProfile = true;

      var profile_followers = JSON.parse(profile.followers);
      var profile_following = JSON.parse(profile.following);

      profile_followers.forEach(function(follower){
          var userProfileImageUrl = '/profile_image/' + follower.pk;
          var profileLink = '/#/profile/' + follower.pk;
          if(!myProfile && userId == follower.pk)
            isFollowing = true
      })
      if(profile_followers.length)
      {
         followers = <div className="follower-div">
                        <div className="follower-font">Followers</div>
                        <div><a className="num" href={followerUrl}>{profile_followers.length}</a></div>
                      </div>
      }

      if(profile_following.length)
      {
         following =  <div className="follower-div">
                        <div className="follower-font">Following</div>
                        <div><a className="num" href={followingUrl}>{profile_following.length}</a></div>
                      </div>
      }

      if(!myProfile)
        var follow = isFollowing ? <Button className="follow" onClick={this.props.unfollow} type="button">Unfollow</Button> :
                                   <Button className="follow" onClick={this.props.follow} type="button">Follow</Button>;

    return (
      <Row className="container">
      <Col>
          <div className="m12">
                <img className="user_photo big left z-depth-1 frame" src={userProfileImageUrl} />
          </div>
          <div>{follow}</div>

      </Col>
      <Col>
            <div className="name">
              {profile.name}
            </div>    
           {bioSection}
      </Col>   
        <Col className="tab">
          {followers}
        </Col>
        <Col>
          {following}
        </Col>
      </Row>
    );
  }
}