import React from 'react';
import { Button, Card, Row, Col } from 'react-materialize';

export default class DisplayUsers extends React.Component {
  render() {
     if(!this.props.users)
      return null;
     var users = JSON.parse(this.props.users);
     var rows = [];
     var columns = [];
     var usersPerRow = 4;
     var i = 0;
     users.forEach(function(user){
        var userProfileImageUrl = '/profile_image/' + user.pk;
        var profileLink = '/#/profile/' + user.pk;

        columns.push( <Col s={2} key={user.pk}>
                        <img height="100" width="100" className="image" src={userProfileImageUrl} alt="profile pic" /> 
                        <div ><a className="name-link" href={profileLink}>{user.fields.name}</a></div>
                      </Col>);
        i++;
        if(i % usersPerRow == 0){
            rows.push(<Row key={i}>{columns}</Row>);
            columns = [];
        }
     });
    if(i % usersPerRow)
        rows.push(<Row key={i}>{columns}</Row>);

    return (
      <div className="container">
      <h2>{this.props.title}</h2>
        <Row>
          {rows}
        </Row>
      </div>
    );
  }
}