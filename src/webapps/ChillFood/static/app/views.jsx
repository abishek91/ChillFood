import React from 'react';
import {Icon} from 'react-materialize';

export default class Views extends React.Component {
  render() {
      if(!this.props.views)
        return null;
    return (
        <div>
          <Icon>visibility</Icon> <span> {this.props.views} Views</span>
        </div>
    );
  }
}