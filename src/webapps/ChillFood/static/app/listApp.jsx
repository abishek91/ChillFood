import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

const GenericList = ({ItemTemplate, items, remove}) => {
  // Map through the items
  const itemNode = items.map((item, index) => {
    return (<ItemTemplate index={index+1} item={item} key={index+1} remove={remove}/>)
  });
  return (<div id="post_container">{itemNode}</div>);
}

// Contaner Component
export default class ListApp extends React.Component{
  render(){
    // Render JSX
    return (
      <div>
        <h5>{this.props.title}</h5>
        <GenericList 
          ItemTemplate={this.props.itemTemplate}
          items={this.props.data} 
          remove={this.props.remove}
        />
        <this.props.form addItem={this.props.addItem} />
      </div>
    );
  }
}