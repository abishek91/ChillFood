import React from 'react';
import Category from './category.jsx'
import Equipment from './equipment.jsx'

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
     var categoryRows = [];
     var recipe =this.state.recipe; 
     var x = JSON.parse(recipe.categories)
      x.forEach(function(category){
        categoryRows.push(<span key={++recipe.id} className="blue-box">{category.fields.name}</span>);
      })
    return (
        <div className="row-padding">
          <Category recipe={recipe} />
          <Equipment recipe={recipe} />
        </div>

    );
  }

}
