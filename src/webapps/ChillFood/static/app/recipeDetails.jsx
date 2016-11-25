import React from 'react';
import SearchBar from './searchBar.jsx'
import Category from './category.jsx'
import Equipment from './equipment.jsx'
import Calories from './calories.jsx'
import Time from './time.jsx'
import Ingredients from './ingredients.jsx'
import PartyCreate from './party/partyCreate.jsx'
import RecipeTitle from './recipeTitle.jsx'
import Steps from './steps.jsx'
import Comments from './comments.jsx'
import ShareBar from './shareBar.jsx'
import ReactStars from 'react-stars'
import Views from './views.jsx'
import { Button, Card, Row, Col } from 'react-materialize';

export default class RecipeDetails extends React.Component {


constructor() {
    super();
    this.state = {
      recipe: undefined
    };
    this.addComment = this.addComment.bind(this);
    this.addDifficulty = this.addDifficulty.bind(this);
    this.addTastiness = this.addTastiness.bind(this);
    this.postData = this.postData.bind(this);
  }

 componentDidMount() {
  var self = this;

  var url = '/recipe_json/' + this.props.params.recipeId 
  fetch(url,{  
      credentials: 'include'})
    .then(function(response) {
      return response.text();
    })
    .then(function(text) { 
      self.setState({recipe: JSON.parse(text)});
    })
  }

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  addDifficulty(difficulty) {
    var body = 'difficulty=' + difficulty;
    var url = '/add_rating/' + this.props.params.recipeId;
    this.postData(url, body)
  }

  addTastiness(tastiness) {
    var body =  'tastiness=' + tastiness;
    var url = '/add_rating/' + this.props.params.recipeId;
    this.postData(url, body)
  }

  addComment(comment) {
    var body = 'text=' + comment;
    var url = '/add_comment/' + this.props.params.recipeId;
    this.postData(url, body)
  }

  postData(url, body) {
    self = this;
    fetch(url, {  
      credentials: 'include',
      method: 'post',  
      headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=unicode",
          "X-CSRFToken": getCookie('csrftoken')
      },  
      body: body  
    })
    .then(function (response) {  
      return response.text();
    })  
    .then(function(recipeJSON) { 
      var recipe = JSON.parse(recipeJSON).recipe;
      self.setState({ 
        recipe: recipe
      });
    })
  }

  render() {
    
    if(!this.state.recipe)
      return null;
    var recipe_image_url = "/recipe_image/" + this.state.recipe.id;
    return (
      <div>
        <SearchBar />
        <div className="container">
          <Row>
            <Col s={6} className="recipe-pic">
              <img src={recipe_image_url} 
              alt="recipe pic" 
              className="big left z-depth-1 frame" />
            </Col>
            <Col s={5}>
              <RecipeTitle 
                difficulty={this.state.recipe.difficulty.difficulty__avg} 
                tastiness={this.state.recipe.tastiness.tastiness__avg}
                title={this.state.recipe.title} 
                cook={this.state.recipe.cook} 
                time={this.state.recipe.time}
                calories={this.state.recipe.calories}
                />
                <div className="row-padding">
                  <Category categories={this.state.recipe.categories} />
                  <Equipment equipment={this.state.recipe.equipment} />
                </div>
            </Col>
          </Row>
          <Row>
            <Col s={6}>
                
                
                <div className="row-padding">
                  <Ingredients ingredients={this.state.recipe.ingredients} />
                  <PartyCreate recipe_id={this.state.recipe.id} recipe_title={this.state.recipe.title}/>
                </div>
                <Steps steps={this.state.recipe.steps} />
            </Col>
            <Col s={5}>
              <Views views={this.state.recipe.views} />
              <ShareBar title={this.props.name} image={recipe_image_url}/>
              <Comments onNewComments={this.addComment} onNewDifficultyRating={this.addDifficulty} 
                        onNewTastinessRating={this.addTastiness} comments={this.state.recipe.comments}
                        difficulty={this.state.recipe.user_rating.difficulty}
                        tastiness={this.state.recipe.user_rating.tastiness} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

}
