import React from 'react';
import DisplayUsers from './displayUsers.jsx'

export default class Followers extends React.Component {
constructor() {
    super();
    this.state = {
      user: undefined
    };
  }

 componentDidMount() {
  var self = this;
  var url = '/profile_json/' + this.props.params.userId; 
  fetch(url,{  
      credentials: 'include'})
    .then(function(response) {
      return response.text();
    })
    .then(function(text) { 
      self.setState({user: JSON.parse(text).user});
    })
  }
  render() {
    if(!this.state.user)
      return null;
    return (
          <DisplayUsers 
            title="Followers"
            users={this.state.user.followers} 
            />
           
    );
  }

}
