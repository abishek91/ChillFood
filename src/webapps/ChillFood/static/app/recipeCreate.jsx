import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';
import RecipeCreateForm from './recipeCreateForm.jsx';

export default class RecipeCreate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      recipe: {
        title: ''
      }
    }
  }

  handleUserInput(recipe) {
    this.setState({
      recipe: recipe
    });    
  }

  handleSave(recipe) {
    console.log('Recipe TBS', recipe)
    this.postData('/api/recipe/create',recipe);
  }

  postData(url, body) {
    self = this;
    fetch(url, {  
      credentials: 'include',
      method: 'POST',  
      headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRFToken": getCookie('csrftoken')
      },  
      body: JSON.stringify(body)   
    })
    .then(function (response) {
      console.log(response);
      var recipe = JSON.parse(response.text());
      console.log('Recipe Saved',recipe)
      self.setState({ 
        recipe: recipe
      });
    })
    .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
    });
  }

  
  render(){
    var recipe = {}
    // Render JSX
    return (
      <Row>
        <Col s={7}>
          <RecipeCreateForm 
              value = {this.state.recipe}
              handleChange = {(e) => this.handleUserInput(e)}
              handleSave = {this.handleSave.bind(this)}
          />       
        </Col>
      </Row>
    );
  }
}