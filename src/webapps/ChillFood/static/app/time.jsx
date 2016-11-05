import React from 'react';

export default class Time extends React.Component {
  render() {
    if(!this.props.recipe)
      return null;
    return (
              <span>
                <img height="15" width="15" src="/static/images//clock-icon.png" alt="clock" />
                <span>{this.props.recipe.time} min</span>
              </span>
    );
  }
}