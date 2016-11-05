import React from 'react';
import Category from './category.jsx'
import Equipment from './equipment.jsx'
import Calories from './calories.jsx'
import Time from './time.jsx'

export default class RecipeDetails extends React.Component {


constructor() {
    super();
    this.state = {
      recipe: undefined
    };
  }

 componentDidMount() {
  var self = this;
  var url = '/recipe_json/' + recipeId 
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(text) { 
      self.setState({recipe: JSON.parse(text)});
    })
  }

  render() {
    if(!this.state.recipe)
      return null;
    return (
      <span>
        <div className="row-padding">
          <Time time={this.state.recipe.time} />
          <Calories calories={this.state.recipe.calories} />
        </div>
        <div className="row-padding">
          <Category categories={this.state.recipe.categories} />
          <Equipment equipment={this.state.recipe.equipment} />
        </div>
      </span>
    );
  }

}
