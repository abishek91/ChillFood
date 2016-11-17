import React from 'react';
import {render} from 'react-dom';
import { Card, Row, Col } from 'react-materialize';

const RecipeThumbnail = ({recipe}) => {
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
                <div id="post_rating">{recipe.tastiness}</div>              
              </div>
              <div className="grey-text col s6 right-align">
                <span id="post_time">{recipe.time}</span> min
              </div>    
            </div>
          </div>      
        </div>      
      </div>    
    // </Row>
    );  
}

export default RecipeThumbnail


