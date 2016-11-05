import React from 'react';

export default class Ingredients extends React.Component {
  render() {
     var ingredientsRows = [];
     var recipeIngredients = JSON.parse(this.props.ingredients)
     var id = 0;
     recipeIngredients.forEach(function(ingredient){
        ingredientsRows.push(<li key={++id}>{ingredient.fields.display}</li>);
     });
    return (
      <span>
        <div className="heading">Ingredients</div>
        <ul>
          {ingredientsRows}
        </ul>
      </span>
    );
  }
}