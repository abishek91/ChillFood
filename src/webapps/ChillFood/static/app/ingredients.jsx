import React from 'react';
import {Collection, CollectionItem} from 'react-materialize';


export default class Ingredients extends React.Component {
  render() {
     var ingredientsRows = [];
     var recipeIngredients = JSON.parse(this.props.ingredients)
     var id = 0;
     recipeIngredients.forEach(function(ingredient){
        ingredientsRows.push(<CollectionItem className="recipe-details-text" key={++id}>{ingredient.fields.display}</CollectionItem>);
     });
    return (
      <span>
        <div className="heading">Ingredients</div>
        <Collection>
          {ingredientsRows}
        </Collection>
      </span>
    );
  }
}