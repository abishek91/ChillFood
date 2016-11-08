import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import { Router, Route, hashHistory } from 'react-router'

const Item = ({item, remove}) => {
  // Each Todo
  return (<li className="list-group-item row" onClick={() => {remove(item.id)}}>
            <div className="col s1">{item.id}</div>
            <div className="col s4">{item.ingredient_name}</div>
            <div className="col s3">{item.quantity}</div>
            <div className="col s3">{item.price}</div>
          </li>);  
}

export default Item