import React from 'react';

export default class Calories extends React.Component {
  
  render() {
      if(!this.props.calories)
        return null;
    return (
        <span className="calories-padding-left">
          <img height="15" width="15" src="/static/images/calories-icon.png" alt="clock" />
          <span>{this.props.calories}</span>
        </span>
    );
  }
}