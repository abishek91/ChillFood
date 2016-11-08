import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import ListApp from './listApp.jsx'
import { Router, Route, hashHistory } from 'react-router'
import { Button, Card, Row, Col } from 'react-materialize';
import StepForm from './stepForm.jsx'
import IngredientForm from './ingredientForm.jsx'
import Ingredient from './ingredient.jsx'
import Item from './item.jsx'


export default class RecipeCreate extends React.Component{ 
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      time: '0',
      calories: '',
      video_link: '',
      ingredients: [],
      steps: [],
    }

    this.handleChange = this.handleChange.bind(this);
  }
  
  handleSave() {

    if (!this.refs.titleInput.value) {
      alert('Please, enter the title of the recipe.');
      return; 
    }

    if (this.state.ingredients.length == 0) {
      alert('Please, enter at least one ingredient.');
      return;
    }

    if (this.state.steps.length == 0) {
      alert('Please, enter at least one step.');
      return;
    }


    var recipe = this.state;

    recipe.title = this.refs.titleInput.value,
    recipe.time = this.refs.timeInput.value,
    recipe.calories = this.refs.caloriesInput.value,
    recipe.video_link = this.refs.video_linkInput.value,
    
    this.props.handleSave(recipe)
  }

  handleChange() {
    var recipe = this.props.value;

    recipe.title = this.refs.titleInput.value,
    recipe.time = this.refs.timeInput.value,
    recipe.calories = this.refs.caloriesInput.value,
    recipe.video_link = this.refs.video_linkInput.value,
    
    this.props.handleChange(recipe)
    // console.log('inside',recipe)
  }

  // Add todo handler
  addIngredient(ingredient_name, quantity, price, display){
    console.log('val',ingredient_name)
    if (!/[\w\d]+/.test(ingredient_name)) {
      //TODO: Pretty Message
      alert('Please, include the name of the ingredient.');
      return;
    }

    // Assemble data
    const item = new RecipeIngredient(this.state.ingredients.length,ingredient_name, quantity, price, display);
    // Update data
    this.state.ingredients.push(item);
    // Update state
    let new_state = {'ingredients': this.state.ingredients}
    this.setState(new_state);
  }

  addStep(val){
    console.log('val',val)
    if (!val) {
      //TODO: Pretty Message
      alert('Please, describe the step.');
      return;
    }
    // Assemble data
    const item = new RecipeStep(this.state.steps.length,val);// {text: val, id: window.id++}
    // Update data
    this.state.steps.push(item);
    // Update state
    let new_state = {}
    new_state.steps = this.state.steps;
    this.setState(new_state);
  }
  // Handle remove
  // handleRemove(id){
  //   // Filter all todos except the one to be removed
  //   const remainder = this.state.data.filter((item) => {
  //     if(item.id !== id) return item;
  //   });
  //   // Update state with filter
  //   this.setState({data: remainder});
  // }

  render () {
    return (
      <div className="container s6" method="post">
          <Row>
            <input type="text" 
            name="title" 
            placeholder="Title" 
            value={this.props.value.title}
            ref="titleInput"
            onChange={this.handleChange}
            />
          </Row>
          <Row>
            <Col s={4} className="input-field">
              <i className="material-icons prefix">query_builder</i>
              <input type="number"
                     name="time" placeholder="minutes"
                     value={this.props.value.time}
                     ref="timeInput"
                     onChange={this.handleChange}
                     />
            </Col>
            <Col s={4} className="input-field">
              <i className="material-icons prefix">local_dining</i>
              <input type="number" 
                     name="calories" 
                     placeholder="kcal"
                     value={this.props.value.calories}
                     ref="caloriesInput"
                     onChange={this.handleChange}
                     />
            </Col>
            <Col s={4} className="input-field">
              <i className="material-icons prefix">videocam</i>
              <input type="text" 
                     name="video_link" 
                     placeholder="YouTube link"
                     value={this.props.value.video_link}
                     ref="video_linkInput"
                     onChange={this.handleChange}
                     />
            </Col>
          </Row>
          <Row>
            <ListApp title="Ingredients" 
              form={IngredientForm}            
              itemTemplate={Ingredient}            
              array="ingredients"
              data={this.state.ingredients}
              addItem={this.addIngredient.bind(this)}
            />
          </Row>
          <Row>
            <ListApp title="Steps"
              form={StepForm}
              itemTemplate={Item}
              array="steps"
              data={this.state.steps}
              addItem={this.addStep.bind(this)}/>
          </Row>
          <button className="right btn waves-effect waves-light blue" type="button" onClick={() => this.handleSave() } >
              Save
          </button>
      </div> 
    );
  }
  
}
// 
// export const RecipeCreateForm = ({addItem}) => {
//   // Input tracker
//   let input;

//   return (
//     <form className="container" method="post">
//        <div className="row">
//         <input type="text" name="title" placeholder="Title" ref={node => {
//           input = node;
//         }}/>
//        </div>
//     </form> 
//   );
// };


// ========================================
function RecipeIngredient(ingredient_id, ingredient_name, quantity, price, display) {
  this.id = ingredient_id;
  this.ingredient_id = ingredient_id | 0;
  this.ingredient_name = ingredient_name;
  console.log('Received quantity',quantity)
  this.quantity = quantity | '1';
  this.price = price | 0;
  this.display = display | ingredient_name;
}

function RecipeStep(id, instruction) {
  this.id = id;
  this.step_number = id;
  this.instruction = instruction;
}