import React from 'react';
import {render} from 'react-dom';
import { Card, Row, Col } from 'react-materialize';

export default class RecipeThumbnail extends React.Component {

  render() {

    let recipe = this.props.recipe;

    const star = (i) => <i className="material-icons" key={i}>star</i>
    const star_empty = (i) => <i className="material-icons" key={i}>star_border</i>
    const star_half = (i) => <i className="material-icons" key={i}>star_half</i>

    const difficulty = (i) => <img width="20" src="/static/images/chef.png" key={i}/>
    
    let stars = []
    for (var i = 1; i <= recipe.tastiness; i++) {
        stars.push(star(i));
    }

    if ((i - recipe.tastiness) == 0.5) {
        stars.push(star_half(i)) 
        i+=1;
    }

    for (; i <= 5; i++) {
        stars.push(star_empty(i));
    }

    let difficulty_icon = []
    if (recipe.difficulty != 10) {
      for (var i = 1; i <= Math.ceil(recipe.difficulty); i++) {
          difficulty_icon.push(difficulty(i));
      }
    }
    // if ((i - recipe.tastiness) == 0.5) {
    //     difficulty_icon.push(star_half(i)) 
    //     i+=1;
    // }

    // for (; i <= 5; i++) {
    //     difficulty_icon.push(difficulty(i));
    // }
    return (
      // <Row>
        <div className="list-item">
          <div  className="card list-content">
            <div className="card-image">
              <a className="post_detail" href={'#/recipe/'+recipe.id}>
                <img id="post_pic" src={'/recipe/'+recipe.id+'/pic'}/>
              </a>
            </div>
            <div className="card-content">
              <a className="post_detail" href={'#/recipe/'+recipe.id}>
                <h5 id="post_title">{recipe.title}</h5> 
              </a>
            </div>  
            <div className="card-footer">
              <div className="row">
                <div className="grey-text col s6">
                  <div id="post_rating" title="tastiness">{stars}</div>              
                </div>
                <div className="grey-text col s6 right-align">
                  <span id="post_time">{recipe.time}</span>&nbsp;&nbsp;Min
                </div>
              </div>
              <div className="row">
                <div className="grey-text col s6">
                  <div id="post_rating" title="difficulty">{difficulty_icon}</div>              
                </div>
                <div className="grey-text col s6 right-align">
                  <span id="post_time">{recipe.views}&nbsp;&nbsp;Views </span>
                </div>    
              </div>
              <div className={"row "+ (recipe.missing_ingredients == undefined ? 'hidden' : '' )}>
                <div className="grey-text text-lighten-1 col s12 right-align">
                  <div id="post_rating" title="difficulty">Missing {recipe.missing_ingredients} ingredient{(recipe.missing_ingredients > 1 ? 's' : '' )}</div>              
                </div>
              </div>
            </div>      
          </div>      
        </div>    
      // </Row>
      );
  }  
}



