import React from 'react';
import ReactStars from 'react-stars'

export default class RecipeTitle extends React.Component {
  render() {
    return (
      <span>
        <div className="title">
          <div>{this.props.title}</div>
          <div className="left">
              <div className="left star" >Difficulty</div>
              <ReactStars edit={false} value={this.props.difficulty} className="left" count={5} size={20} color2={'#ffd700'} />
            </div>
            <div>
              <div className="left tasty star">Tastiness</div>
              <ReactStars edit={false} value={this.props.tastiness} count={5} size={20} color2={'#ffd700'} />
            </div>
        </div>
        <div className="cook"> By {this.props.cook.name}</div>
      </span>
    );
  }
}