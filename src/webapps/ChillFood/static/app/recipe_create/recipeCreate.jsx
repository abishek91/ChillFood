import React from 'react';
import {render} from 'react-dom';
import { Button, Card, Row, Col } from 'react-materialize';
import SearchBar from '../searchBar.jsx'
import RecipeCreateForm from './recipeCreateForm.jsx';
import List from '../api/list.jsx'

export default class RecipeCreate extends React.Component{
  constructor(props){
    super(props);
    
    if (!authenticated)
      window.location.href="/login";
    
    this.state = {
      recipe: {
        title: '',
        categories: [],
        equipments: [],
        cuisines: [],
      }
    }
  }

  handleUserInput(recipe) {
    this.setState({
      recipe: recipe
    });    
  }

  handleSave(recipe) {
    
    this.postData('/api/recipe/create',recipe);
  }

  postData(url, body) {
    self = this;
    let response;
    fetch(url, {  
      credentials: 'include',
      method: 'POST',  
      headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRFToken": getCookie('csrftoken')
      },  
      body: JSON.stringify(body)   
    })
    .then(function(p_response) {
      response = p_response;

      return response.text();
    })
    .then(function(text) { 
      if (response.status == 406) {
        var errors = JSON.parse(text);
        for (var key in errors) {
          Materialize.toast(key+": "+errors[key],2000,'orange')
        }
        
        return;
      } else if (!response.ok) {
          throw Error(response.statusText);
      } else {
        var recipe = JSON.parse(text);
        
        parent.location.hash = '/recipe/'+recipe.id;
      }
    })
    .catch(function(error) {
      Materialize.toast('There has been a problem, please contact your administrator.');
      console.log('There has been a problem with your fetch operation: ' + error.message,400);
    });
  }

  componentWillMount(){
    if (!authenticated)
      window.location.href="/login";
    
    const self = this;
    new List().get()
    .then(function (data) {
      this.setState({
        categories: data.categories,
        equipments: data.equipments,
        cuisines: data.cuisines,
      })
    }.bind(this))
  }

  render(){
    var recipe = {}
    return (
      <div>
        <SearchBar />              
        <div className="container">
          <RecipeCreateForm 
              value = {this.state.recipe}
              handleChange = {(e) => this.handleUserInput(e)}
              handleSave = {this.handleSave.bind(this)}
              categories = {this.state.categories}
              equipments = {this.state.equipments}
              cuisines = {this.state.cuisines}
          />       
        </div>
      </div>
    );
  }
}