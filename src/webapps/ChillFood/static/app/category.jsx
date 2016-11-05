import React from 'react';

export default class Category extends React.Component {
  render() {
    if(!this.props.recipe)
      return null;
     var categoryRows = [];
     var recipe =this.props.recipe; 
     var x = JSON.parse(recipe.categories)
     var id = 0;
      x.forEach(function(category){
        categoryRows.push(<span key={++id} className="blue-box">{category.fields.name}</span>);
      })
    return (
      
        <span className="row-padding">
              {categoryRows}
            </span>
    );
  }
}