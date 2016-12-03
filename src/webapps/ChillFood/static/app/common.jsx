import React from 'react';
import {get2} from './api/api.jsx';

export class Img extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        src: ''
      };
    }

    componentDidMount() {
        var self = this;

        if (!(this.props.src))
          self.setState({ src: '/static/images/empty_profile.gif' });
        else
          self.setState({ src: this.props.src });
        // this.img = new Image();
        // this.img.onerror = function () {
        //   // self.setState({ src: '/static/images/empty_profile.gif' });
        // };
        // this.img.src = this.props.src;
    }

    

    render() {
        
        return (<img className={this.props.className}
                     alt={this.props.alt} 
                     src={this.state.src} />);
    }

};
