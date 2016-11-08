import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

const GenericList = ({ItemTemplate, items, remove}) => {
  // Map through the items
  const itemNode = items.map((item) => {
    return (<ItemTemplate item={item} key={item.id} remove={remove}/>)
  });
  return (<ul>{itemNode}</ul>);
}

// Contaner Component
export default class ListApp extends React.Component{
  handleRemove(id){
    // // Filter all todos except the one to be removed
    // const remainder = this.state.data.filter((item) => {
    //   if(item.id !== id) return item;
    // });
    // // Update state with filter
    // this.setState({data: remainder});
  }
    
  // <ListForm array={this.props.array} addItem={this.props.addItem}/>        
  render(){
    // Render JSX
    return (
      <div>
        <h5>{this.props.title}</h5>
        <GenericList 
          ItemTemplate={this.props.itemTemplate}
          items={this.props.data} 
          remove={this.handleRemove.bind(this)}
        />
        <this.props.form addItem={this.props.addItem} />
      </div>
    );
  }
}