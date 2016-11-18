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
      var followingRows = [];
      var isFollowing = false;
      var redirect = function(profileLink) {
          window.location.href = profileLink
          location.reload()
      }
      var myProfile = false;
      if(profile.id == userId)
        myProfile = true;
      JSON.parse(profile.followers).forEach(function(follower){
          var userProfileImageUrl = '/profile_image/' + follower.pk;
          var profileLink = '/#/profile/' + follower.pk;

          followerRows.push(  <Col key={follower.pk}>
                                <img height="50" width="50" src={userProfileImageUrl} alt="profile pic" /> 
                                <div><a onClick={() => redirect(profileLink)} href={profileLink}>{follower.fields.name}</a></div>
                              </Col>)
          if(!myProfile && userId == follower.pk)
            isFollowing = true
      })

      JSON.parse(profile.following).forEach(function(following){
          var userProfileImageUrl = '/profile_image/' + following.pk;
          var profileLink = '/#/profile/' + following.pk;
          followingRows.push( <Col key={following.pk}>
                                <img height="50" width="50" src={userProfileImageUrl} alt="profile pic" /> 
                                <div><a onClick={() => redirect(profileLink)} href={profileLink}>{following.fields.name}</a></div>
                              </Col>)
      })

      if(!myProfile)
        var follow = isFollowing ? <Button className="follow" onClick={this.props.unfollow} type="button">Unfollow</Button> :
                                   <Button className="follow" onClick={this.props.follow} type="button">Follow</Button>;

    return (
      <Row className="container">
      <Col>
          <div className="m12">
                <img className="user_photo big left z-depth-1 frame" src={userProfileImageUrl} />
            <span className="name">
              {profile.name}
            </span>    
            {bioSection}
            <Row>{follow}</Row>
          </div>   
        </Col>
        <Col className="offset-s3">
          <div className="box">
            <Row><a href={followerUrl}>Followers</a></Row>
            <Row className="list">{followerRows}</Row>
          </div>
          <div className="box">
            <Row><a href={followingUrl}>Following</a></Row>
            <Row>{followingRows}</Row>
          </div>
        </Col>
      </Row>
    );
  }
}