import React from 'react';
import Category from './category.jsx'
import Equipment from './equipment.jsx'
import Calories from './calories.jsx'
import Time from './time.jsx'
import Ingredients from './ingredients.jsx'
import RecipeTitle from './recipeTitle.jsx'
import Steps from './steps.jsx'


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
    var recipe_image_url = "/recipe_image/" + this.state.recipe.id;
    return (
        <span className="col-sm-6 bg-white">
          <img className="recipe-image" height="400" width="400" src={recipe_image_url} alt="recipe pic" />
          <RecipeTitle title={this.state.recipe.title} cook={this.state.recipe.cook} />
          <button className="bookmark">Bookmark</button>
          <div className="row-padding">
            <Time time={this.state.recipe.time} />
            <Calories calories={this.state.recipe.calories} />
          </div>
          <div className="row-padding">
            <Category categories={this.state.recipe.categories} />
            <Equipment equipment={this.state.recipe.equipment} />
          </div>
          <div className="row-padding">
            <Ingredients ingredients={this.state.recipe.ingredients} />
          </div>
          <Steps steps={this.state.recipe.steps} />
        </span>
    );
  }

}
