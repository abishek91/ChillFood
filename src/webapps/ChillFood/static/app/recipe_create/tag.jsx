import React from 'react';
import {render} from 'react-dom';

const Tag = ({item, remove}) => {
  return (<div className="chip" >
            {item.name}
            <i className="close material-icons" onClick={() => {toogle(item.id)}}>close</i>
          </div>);  
}

export default Tag


