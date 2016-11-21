import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';


export default class IngredientForm extends React.Component {
  constructor(props){
    super(props);   
  }

// const IngredientForm = ({input}) => {
  render() {  
    // Input tracker
    // console.log(this.props)
    let addItem = this.props.addItem;
    let input = {};
              
    return (<Row>
                <input 
                  type="text"
                  className="col s5" 
                  placeholder="Ingredient name" 
                  ref={node => { input.name = node; }} />              
                <input 
                  type="text"
                  className="col s3" 
                  placeholder="Quantity" 
                  ref={node => { input.quantity = node; }} />
                <input 
                  type="number"
                  className="col s3" 
                  placeholder="Price" 
                  ref={node => { input.price = node; }} />
                <button className="col s1 waves-effect waves-blue btn btn-flat" 
                type="button" 
                onClick={() => {
                  addItem(input.name.value, input.quantity.value, input.price.value);
                  input.name.value = ''; 
                  input.quantity.value = ''; 
                  input.price.value = '';
                  // input.value = '';
                }}>
                <i className="material-icons blue-text">add</i>
              </button>
            </Row>)
  }
}

// export default IngredientForm