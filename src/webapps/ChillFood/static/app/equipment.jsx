import React from 'react';

export default class Equipment extends React.Component {
  render() {
     var recipeEquipment = JSON.parse(this.props.equipment)

    if(this.props.equipment.length < 3)
      return null;
     var equipmentRows = [];
     var id = 0;
     recipeEquipment.forEach(function(equipment){
        equipmentRows.push(<span key={++id} className="blue-box">{equipment.fields.name}</span>);
     });
    return (
      <span>
        <span>Appliances:</span>
          <span className="row-padding">
              {equipmentRows}
          </span>
      </span>
    );
  }
}