import React from 'react';
import RecipeThumbnail from './home/recipeThumbnail.jsx'

export default class SearchResults extends React.Component {
  render() {
    if(!this.props.data)
      return null;
    const recipeNode = this.props.data.map((recipe, index) => {
        return (<RecipeThumbnail recipe={recipe} key={index}/>)
    });
    return (
          <div className="container">            
              <div id="post_container" className="list">{recipeNode}</div>
              <div className={"center-align " + (this.props.next ? '':'hidden')}>
                  <button id="next" 
                          type="button" 
                          onClick={()=>this.props.load_posts()}
                          className="waves-effect waves-blue btn btn-flat">
                          load more...
                  </button>
              </div>
          </div>
    );
  }
}