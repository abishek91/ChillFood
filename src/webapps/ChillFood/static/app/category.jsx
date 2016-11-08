import React from 'react';

export default class Category extends React.Component {
  render() {
     if(this.props.categories)
      return null;
     var categoryRows = [];
     var categories = JSON.parse(this.props.categories)
     var id = 0;
     categories.forEach(function(category){
        categoryRows.push(<span key={++id} className="blue-box">{category.fields.name}</span>);
     });
    return (
        <span>
          <span>Category:</span>
          <span className="row-padding">
                {categoryRows}
          </span>
        </span>
    );
  }
}