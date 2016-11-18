import React from 'react';
import {render} from 'react-dom';
import SearchBar from '../searchBar.jsx'
import Recipe from '../api/recipe.jsx'
import RecipeThumbnail from './recipeThumbnail.jsx'
import querystring from 'querystring';


export default class RecipeList extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      data: [],
      next: false
    }
    this.recipe = new Recipe();
    this.handleSearch = this.handleSearch.bind(this);
    this.load_posts = this.load_posts.bind(this);
  }

  handleUserInput(recipe) {
    // this.setState({
    //   recipe: recipe
    // });    
  }

// const RecipeList = ({search}) => {
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
    
    this.recipe.get('api/recipes',text,userId,sortBy ? sortBy.value : 0)
    .then(function (data) {
      // console.log('handleSearch',self.recipe.next);
      this.setState({
        data: data,
        next: !!(self.recipe.next)
      })
    }.bind(this))
  }

  componentWillMount() {
    this.handleSearch();
  }

  render() {
  
    // Map through the items
    const recipeNode = this.state.data.map((recipe, index) => {
      return (<RecipeThumbnail recipe={recipe} key={index}/>)
    });
    return (<div>
              <SearchBar handleSearch={this.handleSearch} />
              <div className="container">            
                  <div className="progress">
                        <div className="indeterminate"></div>
                  </div>  
                  <div id="post_container" className="list">{recipeNode}</div>
                  <div className={"center-align " + (this.state.next ? '':'hidden')}>
                      <button id="next" 
                              type="button" 
                              onClick={()=>this.load_posts()}
                              className="waves-effect waves-blue btn btn-flat">
                              load more...
                      </button>
                  </div>
              </div>
            </div>);
  }
}

