import React from 'react';
import {render} from 'react-dom';
import {Row, Col, Input, Icon, Button} from 'react-materialize';
import IngredientForm from './ingredientForm.jsx'


export default class StepForm extends React.Component {
  render() {  
    // Input tracker
    let input = {};
              
    return (<Row>
                <input className="col s11" 
                  placeholder="Describe the step..." 
                  ref={node => { input = node; }} />

                <button className="col s1 waves-effect waves-blue btn btn-flat" 
                type="button" 
                onClick={() => {
                  this.props.addItem(input.value);
                  input.value = '';
                }}>
                <i className="material-icons blue-text">add</i>
              </button>
            </Row>)
  }
    
};