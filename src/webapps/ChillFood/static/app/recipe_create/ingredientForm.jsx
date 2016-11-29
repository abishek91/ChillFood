import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';


export default class IngredientForm extends React.Component {
  constructor(props){
    super(props);   
  }

  componentDidMount(){ 
    const self = this;
    
    $(function() {
       
      self.ingredient_input = $('#multipleIngredientInput').materialize_autocomplete({
          multiple: {
              enable: false,
          },
          dropdown: {
              el: '#multipleIngredientDropdown',
          },
          ignoreCase: false,
          onSelect: function(data){
            self.ingredient_input_id = data.id;

            self.props.addData(data)
            .then(function(data){
              if (data.id) {
                self.ingredient_input_id = data.id;
              }
            })
            .catch(function(data) {
              console.error(data)
              //Clear ingredient
              self.ingredient_input.setValue({})
            })
          },
          cacheable:false,
          getData: self.props.getData,
          appender: {
              el: '.ac-none',
              tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<%= item.text %>"><%= item.text %><i class="material-icons close">close</i></div>'
          }
          
      });   
      console.log(self.ingredient_input)   
    });
  }

  render() {  
    // Input tracker
    let addItem = this.props.addItem;
    let input = {};
    const self = this;
    return (<Row>
                
                <div className="option col s5">
                    <div className="autocomplete" id="single">
                        <div className="ac-input-a">
                            <input type="text" 
                                   id="multipleIngredientInput" 
                                   placeholder="Ingredient name" 
                                   data-activates="multipleIngredientDropdown" 
                                   data-beloworigin="true"
                             />
                        </div>
                        <ul id="multipleIngredientDropdown" className="dropdown-content ac-dropdown"></ul>
                    </div>
                </div>
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
                  // console.log('selection', self.ingredient_input_id)
                  // console.log('selection', this.ingredient_input_id)
                  addItem(this.ingredient_input_id, this.ingredient_input.value, input.quantity.value, input.price.value);
                  // input.name.value = ''; 
                  this.ingredient_input.setValue({})
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