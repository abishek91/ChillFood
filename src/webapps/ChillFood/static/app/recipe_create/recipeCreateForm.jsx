import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';
import ListApp from './listApp.jsx'
import StepForm from './stepForm.jsx'
import IngredientForm from './ingredientForm.jsx'
import Ingredient from './ingredient.jsx'
import IngredientApi from '../api/ingredient.jsx'
import Item from './item.jsx'
import Tags from './tags.jsx'
import RecipePictures from './recipePictures.jsx'
import AutoComplete from '../home/autoComplete.jsx'


export default class RecipeCreate extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      time: '0',
      calories: '',
      video_link: '',
      ingredients: [],
      steps: [],
      category_set:[],
      equipment_set: [],
      cuisine_set: [],
    }
    this.category_set = []
    this.equipment_set = []
    this.cuisine_set = []
    this.picture = ""
    this.appliances = [{id:1,name:'hey'},{id:2,name:'hey2'}]
    this.handleChange = this.handleChange.bind(this);
    this.updatePicture = this.updatePicture.bind(this);
    this.onAppend = this.onAppend.bind(this);
  }
  
  handleSave() {
    if (!this.refs.titleInput.value) {
      Materialize.toast('Please, enter the title of the recipe.',4000);
      return; 
    }

    if (!this.refs.timeInput.value) {
      Materialize.toast('Please, enter the the time needed to make the recipe.',4000);
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
    if (recipe.video_link)
      recipe.video_link = recipe.video_link.trim()
    recipe.category_set = this.category_set;
    recipe.equipment_set = this.equipment_set;
    recipe.cuisine_set = this.cuisine_set;
    if (this.state.remote_pic) {
      recipe.remote_pic = this.state.remote_pic
    }
    this.props.handleSave(recipe)
  }

  handleChange() {
    var recipe = this.props.value;

    recipe.title = this.refs.titleInput.value
    recipe.time = this.refs.timeInput.value
    recipe.calories = this.refs.caloriesInput.value
    recipe.video_link = this.refs.video_linkInput.value
    if (this.state.remote_pic) {
      recipe.remote_pic = this.state.remote_pic
    }
    
    this.props.handleChange(recipe)
    // console.log('inside',recipe)
  }

  updatePicture(url) {
    this.setState({
      remote_pic: url
    })
    this.remote_pic = url;
  }

  // Add todo handler
  addIngredient(ingredient_id, ingredient_name, quantity, finishSuccesfully){
    let error = true;
    const self = this;
    if (!/[\w\d]+/.test(ingredient_name)) {
      Materialize.toast('Please, include the name of the ingredient.', 4000, 'orange');
      finishSuccesfully(false);
    } else {

      let ingredient_api = new IngredientApi()
      ingredient_api.get(ingredient_name, true)
      .then(function(data) {

        if (data.data.length == 0) {
          Materialize.toast('Please, select or add one ingredient to the list.', 4000, 'orange');
          finishSuccesfully(false);
        } else {

          ingredient_id = data.data[0].id;
          ingredient_name = data.data[0].text;

          const duplicated = self.state.ingredients.filter((item) => {
            if(item.ingredient_id === ingredient_id) return item;
          });

          if (duplicated.length) {
            Materialize.toast('You have alread added this ingredient.', 4000, 'orange');
            throw Error("Duplicated ingredient_id", ingredient_id)
          }

          // Assemble data
          const item = new RecipeIngredient(self.state.ingredients.length, ingredient_id, ingredient_name, quantity);
          // Update data
          self.state.ingredients.push(item);
          // Update state
          let new_state = {'ingredients': self.state.ingredients}
          self.setState(new_state);

          finishSuccesfully(true);
        }

      })
      .catch(function (error) {
        console.error('addIngredient', error)
        finishSuccesfully(false);
      })

    }
  }

  addStep(val){
    if (!val) {
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

  getIngredientData(value, callback) {
    let ingredient_api = new IngredientApi()
    ingredient_api.get(value)
    .then(function(data) {
      let newData =  data.data
      newData.push({id:0, text: value, extra:'+ '})
      console.log('ingredients',newData);
      callback(value,newData);
    })
  }

  createIngredient(item) {
    console.log(item)
    if (item.id == 0) {
      let ingredient_api = new IngredientApi()
      return ingredient_api.create(item.text.trim())
      .then(function (data) {
        Materialize.toast('Your ingredient was created succesfully.', 4000, 'blue') 
        return data;
      })
    }
    return Promise.resolve({});
  }

  onAppend(data) {
    return (item) => {
      data.push(item.id);
    }
  }

  onRemove(data) {
    return (item) => {
      var index = data.indexOf(item.id);
      if(index!=-1){
         data.splice(index, 1);
      }
    }
  }

  render () {
    return (
      <Row>
        <Col s={12}>
            <RecipePictures src={this.state.remote_pic} updatePicture={this.updatePicture} />
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
                     pattern="^https?:\/\/www\.youtube\.com\/watch\?v=\w*$"
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
              getData={this.getIngredientData.bind(this)}
              addData={this.createIngredient.bind(this)}
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
          <Row>
            <h5>Tags</h5>
          </Row>
          <Row>
            <AutoComplete 
              name="category" 
              placeholder="Pick a category? Ex. Non-vegan" 
              data={this.props.categories}
              onAppend={this.onAppend(this.category_set)}
              onRemove={this.onRemove(this.category_set)}
               />
          </Row>
          <Row>
            <AutoComplete 
              name="cuisine" 
              placeholder="Pick a cuisines? Ex. Mexican" 
              data={this.props.cuisines}
              onAppend={this.onAppend(this.cuisine_set)}
              onRemove={this.onRemove(this.cuisine_set)}
               />
          </Row>
          <Row>
            <AutoComplete 
              name="equipment" 
              placeholder="Which equipments are needed? Ex. Oven" 
              data={this.props.equipments}
              onAppend={this.onAppend(this.equipment_set)}
              onRemove={this.onRemove(this.equipment_set)}
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

function RecipeIngredient(id, ingredient_id, ingredient_name, quantity, display) {
  this.id = id;
  this.ingredient_id = ingredient_id | 0;
  this.ingredient_name = ingredient_name;
  this.quantity = quantity || '1';
  this.display = this.quantity + ' ' + ingredient_name;
}

function RecipeStep(id, instruction) {
  this.id = id;
  this.step_number = id;
  this.instruction = instruction;
}