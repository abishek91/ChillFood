import React from 'react';
import Rating from 'react-rating'

export default class RecipeTitle extends React.Component {
  render() {
    var profileLink = '/profile/' + this.props.cook.id;
    return (
      <span>
        <div className="title">
          <div>{this.props.title}</div>
          <div className="left">
              <div className="left star" >Difficulty</div>
              <Rating readonly={true} initialRate={parseFloat(this.props.difficulty)} className="left" fractions={2}
                      full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star" />
            </div>
            <div>
              <div className="left tasty star">Tastiness</div>
              <Rating readonly={true} initialRate={parseFloat(this.props.tastiness)} fractions={2}
                      full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star" />
            </div>
        </div>
        <div className="cook"> By <a href={profileLink}>{this.props.cook.name}</a></div>
      </span>
    );
  }
}