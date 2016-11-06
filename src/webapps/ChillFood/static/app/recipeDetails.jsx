import React from 'react';
import Category from './category.jsx'
import Equipment from './equipment.jsx'
import Calories from './calories.jsx'
import Time from './time.jsx'
import Ingredients from './ingredients.jsx'
import RecipeTitle from './recipeTitle.jsx'
import Steps from './steps.jsx'
import Comments from './comments.jsx'
import ReactStars from 'react-stars'
import { Button, Card, Row, Col } from 'react-materialize';


export default class RecipeDetails extends React.Component {


constructor() {
    super();
    this.state = {
      recipe: undefined
    };
    this.addCommment = this.addCommment.bind(this);
    this.addDifficulty = this.addDifficulty.bind(this);
    this.addTastiness = this.addTastiness.bind(this);
  }

 componentDidMount() {
  var self = this;
  var url = '/recipe_json/' + recipeId 
  fetch(url)
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
    this.addCommment(null, null, difficulty)
  }


  addTastiness(tastiness) {
    this.addCommment(null, tastiness, null)
  }

  addCommment(text, tastiness, difficulty) {
    var url = '/add_comment/' + recipeId;
    var body ='';
    var appender = '';
    if(text)
    {
      body += 'text=' + text;
      appender = '&';
    }
    if(tastiness)
    {
      body += appender + 'tastiness=' + tastiness;
      appender = '&';
    }
    if(difficulty)
    {
      body += appender + 'difficulty=' + difficulty;
    }
    self = this;
    fetch(url, {  
      credentials: 'include',
      method: 'post',  
      headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRFToken": getCookie('csrftoken')
      },  
      body: body  
    })
    .then(function (response) {  
      return response.text();
    })  
    .then(function(commentJSON) { 
      var id = 0;
      var comment = JSON.parse(commentJSON).comment;
 
      self.setState({ 
        recipe: comment
      });
    })
  }

  render() {
    if(!this.state.recipe)
      return null;
    var recipe_image_url = "/recipe_image/" + this.state.recipe.id;
    return (
      <Row>
        <Col s={5} className="offset-s1">
            <img className="recipe-image" height="400" width="400" src={recipe_image_url} alt="recipe pic" />
            <RecipeTitle difficulty={this.state.recipe.difficulty.difficulty__avg} tastiness={this.state.recipe.tastiness.tastiness__avg}
                         title={this.state.recipe.title} cook={this.state.recipe.cook} />
            <button className="bookmark">Bookmark</button>
            <div className="row-padding">
              <Time time={this.state.recipe.time} />
              <Calories calories={this.state.recipe.calories} />
            </div>
            <div className="row-padding">
              <Category categories={this.state.recipe.categories} />
              <Equipment equipment={this.state.recipe.equipment} />
            </div>
            <div className="row-padding">
              <Ingredients ingredients={this.state.recipe.ingredients} />
            </div>
            <Steps steps={this.state.recipe.steps} />
        </Col>
        <Col s={5}>
          <Comments onNewComments={this.addCommment} onNewDifficultyRating={this.addDifficulty} 
                    onNewTastinessRating={this.addTastiness} comments={this.state.recipe.comments}/>
        </Col>
      </Row>
    );
  }

}
