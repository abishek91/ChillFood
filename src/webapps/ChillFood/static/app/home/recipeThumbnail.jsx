import React from 'react';
import {render} from 'react-dom';
import { Card, Row, Col } from 'react-materialize';

// const RecipeThumbnail = ({recipe}) => {
export default class RecipeThumbnail extends React.Component {

  render() {

    let recipe = this.props.recipe;

    const star = (i) => <i className="material-icons" key={i}>star</i>
    const star_empty = (i) => <i className="material-icons" key={i}>star_border</i>
    const star_half = (i) => <i className="material-icons" key={i}>star_half</i>

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

    return (
      // <Row>
        <div className="list-item">
          <div  className="card list-content">
            <div className="card-image">
              <a className="post_detail" href={'/recipe/'+recipe.id+'/#/recipe/'+recipe.id}>
                <img id="post_pic" src={'/recipe/'+recipe.id+'/pic'}/>
              </a>
            </div>
            <div className="card-content">
              <a className="post_detail" href={'/recipe/'+recipe.id+'/#/recipe/'+recipe.id}>
                <h5 id="post_title">{recipe.title}</h5> 
              </a>
            </div>  
            <div className="card-footer">
              <div className="row">
                <div className="grey-text col s6">
                  <div id="post_rating">{stars}</div>              
                </div>
                <div className="grey-text col s6 right-align">
                  <span id="post_time">{recipe.time}</span>&nbsp;&nbsp;Min
                </div>
              </div>
              <div className="row">
                <div className="grey-text col s6">
                  <div id="post_rating">{recipe.difficulty < 6 ? 'Dif: '+recipe.difficulty : ''}</div>              
                </div>
                <div className="grey-text col s6 right-align">
                  <span id="post_time">{recipe.views}&nbsp;&nbsp;Views </span>
                </div>    
              </div>
            </div>      
          </div>      
        </div>    
      // </Row>
      );
  }  
}


