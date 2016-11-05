import React from 'react';

export default class Equipment extends React.Component {
  render() {
    if(!this.props.recipe)
      return null;
     var equipmentRows = [];
     var recipe =this.props.recipe; 
     var recipeEquipment = JSON.parse(recipe.equipment)
     var id = 0;
     recipeEquipment.forEach(function(equipment){
        equipmentRows.push(<span key={++id} className="blue-box">{equipment.fields.name}</span>);
     });
    return (
      <span>
        <span className="appliances-padding-left">Appliances:</span>
          <span className="row-padding">
              {equipmentRows}
          </span>
      </span>
    );
  }
}