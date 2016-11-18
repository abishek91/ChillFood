import React from 'react';
import Rating from 'react-rating'
import {Row, Col, Input, Icon, Button} from 'react-materialize';

export default class RecipeTitle extends React.Component {
  render() {
    var profileLink = '/#/profile/' + this.props.cook.id;
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
        </Row>
      </span>
    );
  }
}