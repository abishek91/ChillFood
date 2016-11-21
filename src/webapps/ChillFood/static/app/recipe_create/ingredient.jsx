import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import {Row, Col} from 'react-materialize';

const Item = ({index, item, remove}) => {
  //  Each Todo
  return (<Row className="" onClick={() => {remove(item.id)}}>
              <div className="col s1">{index}</div>
              <div className="col s4">{item.ingredient_name}</div>
              <div className="col s3">{item.quantity}</div>
              <div className="col s3">{item.price}</div>
              <button className="col s1 waves-effect waves-blue btn btn-flat" 
                  type="button" 
                  onClick={() => { remove(item.id); }}>
                  <i className="material-icons blue-text">remove</i>
              </button>
          </Row>);  
}

export default Item