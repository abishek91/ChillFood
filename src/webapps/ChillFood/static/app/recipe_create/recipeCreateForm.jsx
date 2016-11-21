import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';
import ListApp from './listApp.jsx'
import StepForm from './stepForm.jsx'
import IngredientForm from './ingredientForm.jsx'
import Ingredient from './ingredient.jsx'
import Item from './item.jsx'
import Tags from './tags.jsx'
import RecipePictures from './recipePictures.jsx'


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
    this.picture = ""
    this.appliances = [{id:1,name:'hey'},{id:2,name:'hey2'}]
    this.handleChange = this.handleChange.bind(this);
    this.updatePicture = this.updatePicture.bind(this);
  }
  
  handleSave() {

    if (!this.refs.titleInput.value) {
      Materialize.toast('Please, enter the title of the recipe.',4000);
      return; 
    }

    if (this.state.ingredients.length == 0) {
      Materialize.toast('Please, enter at least one ingredient.',4000);
      return;
    }

    if (this.state.steps.length == 0) {
      Materialize.toast('Please, enter at least one step.',4000);
      return;
    }


    var recipe = this.state;

    recipe.title = this.refs.titleInput.value;
    recipe.time = this.refs.timeInput.value;
    recipe.calories = this.refs.caloriesInput.value;
    recipe.video_link = this.refs.video_linkInput.value;
    if (this.remote_pic) {
      recipe.remote_pic = this.remote_pic
    }

    this.props.handleSave(recipe)
  }

  handleChange() {
    var recipe = this.props.value;

    recipe.title = this.refs.titleInput.value
    recipe.time = this.refs.timeInput.value
    recipe.calories = this.refs.caloriesInput.value
    recipe.video_link = this.refs.video_linkInput.value
    if (this.remote_pic) {
      recipe.remote_pic = this.remote_pic
    }
    
    this.props.handleChange(recipe)
    // console.log('inside',recipe)
  }

  updatePicture(url) {
    this.remote_pic = url;
  }

  // Add todo handler
  addIngredient(ingredient_name, quantity, price, display){
    console.log('val',ingredient_name)
    if (!/[\w\d]+/.test(ingredient_name)) {
      //TODO: Pretty Message
      Materialize.toast('Please, include the name of the ingredient.',4000);
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
    if (!val) {
      //TODO: Pretty Message
      Materialize.toast('Please, describe the step.', 4000) // 4000 is the duration of the toast
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
  
  toogleApplicances(index) {
    this.appliances[index]
    // remove = false;
    // for (var i in this.state.appliances) {
    //   if (this.state.appliances[i].id === index) {
    //     remove = true
    //     break;
    //   }
    // }



    // const appliance = this.appliances.filter((item) => {
    //   if(item.id === id) return item;
    // });
    // Update state with filter
    this.setState({ingredients: remainder});
  }
  // Handle remove
  handleRemoveIngredient(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.ingredients.filter((item) => {
      if(item.id !== id) return item;
    });
    // Update state with filter
    this.setState({ingredients: remainder});
  }
  handleRemoveStep(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.steps.filter((item) => {
      if(item.id !== id) return item;
    });
    // Update state with filter
    this.setState({steps: remainder});
  }

  render () {
    return (
      <Row>
        <Col s={12}>
            <RecipePictures updatePicture={this.updatePicture} />
        </Col>
        <Col s={6}>
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
              remove={this.handleRemoveIngredient.bind(this)}
            />
          </Row>
          <Row>
            <ListApp title="Steps"
              form={StepForm}
              itemTemplate={Item}
              data={this.state.steps}
              addItem={this.addStep.bind(this)}
              remove={this.handleRemoveStep.bind(this)}
              />
          </Row>
          <button className="right btn waves-effect waves-light blue" type="button" onClick={() => this.handleSave() } >
              Save
          </button>
        </Col>         
      </Row>
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
  if (quantity == undefined)
    this.quantity = '1';
  else
    this.quantity = quantity;
  this.price = price | 0;
  this.display = this.quantity + ' ' + ingredient_name;
}

function RecipeStep(id, instruction) {
  this.id = id;
  this.step_number = id;
  this.instruction = instruction;
}