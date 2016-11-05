import React from 'react';

export default class RecipeTitle extends React.Component {
  render() {
    return (
      <span>
        <div className="title">
          <span>{this.props.title}</span>
        </div>
        <div className="cook"> By {this.props.cook.name}</div>
      </span>
    );
  }
}