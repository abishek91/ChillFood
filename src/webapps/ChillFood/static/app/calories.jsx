import React from 'react';

export default class Calories extends React.Component {
  render() {
    if(!this.props.recipe)
      return null;
    return (
              <span className="calories-padding-left">
                <img height="15" width="15" src="/static/images/calories-icon.png" alt="clock" />
                <span>{this.props.recipe.calories}</span>
              </span>
    );
  }
}