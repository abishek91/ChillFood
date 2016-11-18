import React from 'react';
import SearchBar from './searchBar.jsx'
import ProfileDetails from './profileDetails.jsx'
import RecipeList from './home/recipeList.jsx'

import { Button, Card, Row, Col } from 'react-materialize';


export default class Profile extends React.Component {

constructor() {
    super();
    this.state = {
      user: undefined
    };
  }

 componentDidMount() {
  var self = this;
  var url = '/profile_json/' + userId; 
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
    return (
      <div>
        <ProfileDetails user={this.state.user} />
        <RecipeList />
      </div>
    );
  }

}
