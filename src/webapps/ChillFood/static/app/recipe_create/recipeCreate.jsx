import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';
import SearchBar from '../searchBar.jsx'
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
    .then(function(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }

      return response.text();
    })
    .then(function(text) { 
      var recipe = JSON.parse(text);
      console.log('Recipe Saved',recipe)
      parent.location.hash = '/recipe/'+recipe.id;
      // location.pathname = '/recipe/'+recipe.id
    })
    .catch(function(error) {
      Materialize.toast('There has been a problem, please contact your administrator.');
      console.log('There has been a problem with your fetch operation: ' + error.message,400);
    });
  }

  
  render(){
    var recipe = {}
    // Render JSX
    return (
      <div>
        <SearchBar />              
        <div className="container">
          <RecipeCreateForm 
              value = {this.state.recipe}
              handleChange = {(e) => this.handleUserInput(e)}
              handleSave = {this.handleSave.bind(this)}
          />       
        </div>
      </div>
    );
  }
}