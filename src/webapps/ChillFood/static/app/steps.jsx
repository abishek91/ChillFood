import React from 'react';
import {Collection, CollectionItem} from 'react-materialize';

export default class Steps extends React.Component {
  render() {
     var stepRows = [];
     var steps = JSON.parse(this.props.steps)
     var id = 0;
     steps.forEach(function(step){
        var imageUrl = "/step_image/" + step.pk;
        stepRows.push(
          <CollectionItem key={++id} className="row-padding">
              <div className="step-padding recipe-details-text sub-heading">Step {step.fields.step_number} </div>
              { step.fields.picture.name ?
                <span>
                  <img height="100" width="100" src={imageUrl} alt="step pic" />
               </span> : null
              }
              <div className="recipe-details-text">
                {step.fields.instruction}
              </div>
            </CollectionItem>
        );
      });
    return (
      <span>
        <div className="heading recipe-details-text row-padding">Steps</div>
        <Collection>

              {stepRows}
        </Collection>

      </span>
    );
  }
}