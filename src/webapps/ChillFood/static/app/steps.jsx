import React from 'react';

export default class Steps extends React.Component {
  render() {
     var stepRows = [];
     var steps = JSON.parse(this.props.steps)
     var id = 0;
     steps.forEach(function(step){
        var imageUrl = "/step_image/" + step.pk;
        stepRows.push(
          <div key={++id} className="row-padding">
              <div className="step-padding sub-heading">Step {step.fields.step_number} </div>
              { step.fields.picture.name ?
                <span>
                  <img height="100" width="100" src={imageUrl} alt="step pic" />
               </span> : null
              }
              <div className="instruction">
                {step.fields.instruction}
              </div>
            </div>
        );
      });
    return (
      <span>
        <div className="heading row-padding">Steps</div>
              {stepRows}
      </span>
    );
  }
}