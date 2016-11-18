import React from 'react';
import DisplayUsers from './displayUsers.jsx'

export default class Following extends React.Component {
constructor() {
    super();
    this.state = {
      user: undefined
    };
  }

 componentDidMount() {
  var self = this;
  var url = '/profile_json/1';// + this.props.userId; 
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
            title="Following"
            users={this.state.user.following} 
            />
           
    );
  }

}
