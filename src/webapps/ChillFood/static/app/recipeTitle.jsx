import React from 'react';
import Rating from 'react-rating'
import {Row, Col, Input, Icon, Button} from 'react-materialize';

export default class RecipeTitle extends React.Component {
  render() {
    var profileLink = '/profile/' + this.props.cook.id;
    var followLink = '/follow/' + this.props.cook.id;
    var unfollowLink = '/unfollow/' + this.props.cook.id;
    var followerRows = [];
    var followingRows = [];
    var isFollowing = false;
    JSON.parse(this.props.cook.followers).forEach(function(follower){
        var userProfileImageUrl = '/profile_image/' + follower.pk;
        followerRows.push(  <span key={follower.pk}>
                              <img height="30" width="30" src={userProfileImageUrl} alt="profile pic" /> 
                              <div>{follower.fields.username}</div>
                            </span>)
        if(follower.pk == userId)
          isFollowing = true
    })
    JSON.parse(this.props.cook.following).forEach(function(following){
        var userProfileImageUrl = '/profile_image/' + following.pk;
        followingRows.push( <span key={following.pk}>
                              <img height="30" width="30" src={userProfileImageUrl} alt="profile pic" /> 
                              <div>{following.fields.username}</div>
                            </span>)
    })
    var follow = isFollowing ? <Button href={unfollowLink}  type="button">Unfollow</Button> :
                               <Button href={followLink}  type="button">Follow</Button>;
    return (
      <span>
        <Row>
          <h2>{this.props.title}</h2>
            <Col s={4} className="left">
              <span className="left cook">Difficulty&nbsp;&nbsp;&nbsp;</span>
              <Rating readonly={true} initialRate={parseFloat(this.props.difficulty)} className="left" fractions={2}
                      full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star" />
            </Col>
            <Col s={8}>
              <span className="left tasty cook">Tastiness&nbsp;&nbsp;&nbsp;</span>
              <Rating readonly={true} initialRate={parseFloat(this.props.tastiness)} fractions={2}
                      full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star" />
            </Col>
            <Col s={12} className="cook">
              <Icon>person</Icon> <a href={profileLink}>{this.props.cook.name}</a>

            </Col>
            <Col s={12} className="cook">
              <Icon>query_builder</Icon> {this.props.time} min
            </Col>
            <Col s={12} className="cook">
              <Icon>local_dining</Icon> {this.props.calories} cal
            </Col>
              <Row>{follow}</Row>
              <Row>{followerRows}</Row>
              <Row>{followingRows}</Row>
        </Row>
      </span>
    );
  }
}