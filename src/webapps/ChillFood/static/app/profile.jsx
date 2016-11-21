import React from 'react';
import SearchBar from './searchBar.jsx'
import ProfileDetails from './profileDetails.jsx'
import RecipeList from './home/recipeList.jsx'
import Recipe from './api/recipe.jsx'
import SearchResults from './searchResults.jsx'



export default class Profile extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      data: [],
      next: false
    };
    this.recipe = new Recipe();
    this.handleSearch = this.handleSearch.bind(this);
    this.load_posts = this.load_posts.bind(this);
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  load_posts (argument) {
    // body...
    let self = this;

    var x = 1;
    this.recipe.getMore()
    .then(function (data) {
      this.setState((prevState, props) => {
        return {
          data: prevState.data.concat(data),
          next: !!(self.recipe.next)
        }
      })
    }.bind(this))

  }

  
  handleSearch(text, userId, sortBy) {
    let self = this;
    console.log('hola',userId,3,this.props.params.userId)
    
    this.recipe.get(text,userId,sortBy ? sortBy.value : 1)
    .then(function (data) {
      // console.log('handleSearch',self.recipe.next);
      this.setState({
        data: data,
        next: !!(self.recipe.next)
      })
    }.bind(this))
  }

  componentWillMount() {
    this.handleSearch('', this.props.params.userId);
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

  follow() {
    var self = this;
    var url = "/follow/" + this.props.params.userId;
    fetch(url,{  
      credentials: 'include'})
    .then(function(response) {
      return response.text();
    })
    .then(function(text) { 
      self.setState({user: JSON.parse(text).user});
    })
  }

  unfollow() {
    var self = this;
    var url = "/unfollow/" + this.props.params.userId;
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
      <div>
        <SearchBar handleSearch={this.handleSearch} />
        <ProfileDetails profile={this.state.user} follow={this.follow} unfollow={this.unfollow} />
        <div className="name container">Uploaded recipes</div>
        <SearchResults next={this.state.next} data={this.state.data} load_posts={this.load_posts} />
      </div>
    );
  }

}
