import React from 'react';
import {render} from 'react-dom';

const Item = ({index, item, remove}) => {
  
  // Each Todo
  return (<li className="list-group-item row">
            <div className="col s1">{index}</div>
            <div className="col s10">{item.instruction}</div> 
            <button className="col s1 waves-effect waves-blue btn btn-flat" 
                type="button" 
                onClick={() => { remove(item.id); }}>
                <i className="material-icons blue-text">remove</i>
            </button>           
          </li>);  
}

export default Item