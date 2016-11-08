import React from 'react';
import Tag from './tag.jsx'


const GenericList = ({items, toogle}) => {
  // Map through the items
  const itemNode = items.map((item) => {
    return (<Tag item={item} key={item.id} toogle={toogle}/>)
  });
  return (<span>{itemNode}</span>);
}

export default class Tags extends React.Component {
  render() {      
    return (
        <div>          
          <span>{this.props.title}</span> 
            <span className="chips chips-initial">
            <GenericList 
              items={this.props.data}
              toogle={this.props.toogle}
              />            
          </span>
        </div>
    );
  }
}


