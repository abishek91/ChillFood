import React from 'react';
import { Button, Card, Row, Col } from 'react-materialize';

export default class DisplayUsers extends React.Component {
  render() {
     if(!this.props.users)
      return null;
     var users = JSON.parse(this.props.users);
     var rows = [];
     var columns = [];
     var usersPerRow = 5;
     var i = 1;
     users.forEach(function(user){
        var userProfileImageUrl = '/profile_image/' + user.pk;
        var profileLink = '/profile/' + user.pk;

        columns.push( <Col s={2} key={user.pk}>
                        <img className="image" src={userProfileImageUrl} alt="profile pic" /> 
                        <a className="name-link" href={profileLink}>{user.fields.name}</a>
                      </Col>);
        i++;
        if(i % usersPerRow == 0){
            rows.push(<Row>{columns}</Row>);
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