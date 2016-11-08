import React from 'react';
import {render} from 'react-dom';

const Item = ({index, item, remove}) => {
  
  // Each Todo
  return (<li className="list-group-item row" onClick={() => {remove(item.id)}}>
            <div className="col s1">{index}</div>
            <div className="col s3">{item.instruction}</div>            
          </li>);  
}

export default Item