import React from 'react';
import {render} from 'react-dom';
import {Row, Col, Input, Icon, Button} from 'react-materialize';
import SearchBar from '../searchBar.jsx'
import Recipe from '../api/recipe.jsx'
import querystring from 'querystring';
import List from '../api/list.jsx'
import IngredientApi from '../api/ingredient.jsx'
import Preferences from '../api/preferences.jsx'
import RecipeThumbnail from './recipeThumbnail.jsx'
import SortBar from './sortBar.jsx'
import Sidebar from './sidebar.jsx'

const sortOptions = [ {label:'time',value: 5},
                      {label:'tastiness',value: 4},
                      // {label:'views',value: 1},
                      {label:'difficulty',value: 2},
                      {label:'calories',value: 3},
                      ]

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props);   
    
    this.state = {
      search: {
        sortBy: sortOptions[0],        
      },
      data: [],
      next: false,
      categories: [],
      equipments: [],
      cuisines: [],   
      initDataCuisine: [],
      initDataEquipment: [],   
    }
    this.hasVideo = false;
    this.selected_categories=[];
    this.selected_ingredients=[];
    this.selected_cuisines=[];
    this.selected_equipments=[];
    this.recipe = new Recipe();
    
    this.handleVideo = this.handleVideo.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.load_posts = this.load_posts.bind(this);
    this.initialize = this.initialize.bind(this);
    this.onAppend = this.onAppend.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  handleSort(sortBy) {
    let self = this;
    // let search = this.state.search;
    this.state.search.sortBy = sortBy;
    
    // this.setState({
    //   search:search
    // });

    this.search()
  }

  userDefault(sortBy) {    
    let sort = sortOptions[0];
    for (var i in sortOptions) {
      if (sortOptions[i].value == sortBy) {
        sort = sortOptions[i];
        break
      }
    }

    return sort;
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

  handleVideo(item) {
    this.hasVideo = !this.hasVideo;
    this.search();
  }

  handleSearch(text, userId) {
    let self = this;
    let search = this.state.search;
    search.text = text;
    this.setState({
      search:search
    });

    this.search();
  }

  search() {
    let self = this;
    const search = this.state.search;
    
    this.recipe.get(search.text,
      search.userId,
      search.sortBy ? search.sortBy.value : 1, //TODO: Remove condition
      this.selected_categories,
      this.selected_cuisines,
      this.selected_equipments,
      this.hasVideo,
      this.selected_ingredients
    ).then(function (data) {
      
      this.setState({
        search: search,
        data: data,
        next: !!(self.recipe.next)
      });

    }.bind(this))
  }

  handleCheck(option) {
    option.selected = !option.selected;
    const categories = this.state.categories.filter((c)=> c.selected)
    this.selected_categories = categories.map(function (c) {
      return c.id;
    });

    this.setState((prevState, props) => {
        prevState.search.categories = categories;
        return {
          search: prevState.search
        }
      });

    this.search();
  }

  componentWillMount(){
    const self = this;
    let sortBy;
    let selected_cuisines,selected_equipments;
    new Preferences().get()
    .then(function (preferences) {
      this.hasVideo = false; //Check how to update the fucking check
      sortBy = preferences.sort_by;
      this.selected_categories=preferences.categories;
      selected_cuisines=preferences.cuisines;
      selected_equipments=preferences.equipments; 
      this.search(); 
      return new List().get();
    }.bind(this))
    .then(function (data) {
      data.categories.map(function(c) {
        c.selected = self.selected_categories.indexOf(c.id) >= 0;
        return c;
      })
      
      this.setState({
        search:{
          sortBy: self.userDefault(sortBy)
        },
        categories: data.categories,
        equipments: data.equipments,
        cuisines: data.cuisines,
      })

      self.initialize(selected_cuisines,selected_equipments, data.cuisines,data.equipments)
    }.bind(this))
  }

  // #TODO: Look for a better way
  initialize(selected_cuisines, selected_equipments, cuisines,equipments) {
    const self = this;
    
    //Initialize Tags
    
    let initDataCuisine = []
    selected_cuisines.forEach(function (item) {
      const cuisine = cuisines.filter(function (e) {
        return e.id == item;
      })
      
      initDataCuisine.push({id:item,text:cuisine[0].text});
    });

    
    let initDataEquipment = []
    selected_equipments.forEach(function (item) {
      const equipment = equipments.filter(function (e) {
        return e.id == item;
      })
      initDataEquipment.push({id:item,text:equipment[0].text});
    });

    this.setState({
      initDataCuisine: initDataCuisine,
      initDataEquipment: initDataEquipment,
    })
  }

  onAppend(data) {
    const self = this
    return (item) => {
      data.push(item.id);
      self.search();
    }
  }

  
  onRemove(data) {
    console.log(1,data)
    const self = this
    return (item) => {
      console.log('ingedient removed')
      var index = data.indexOf(item.id);
      if(index!=-1){
         data.splice(index, 1);
      }
      self.search();
    }
  }

  getIngredients(value,callback){
    let ingredient_api = new IngredientApi()
    ingredient_api.get(value)
    .then(function(data) {
      
      if (data.data.length == 0) {
        data.data = [{id:0, text: ' + '+value}]
      }
      callback(value,data.data);
    })
  }
  
  render() {
    
    // Map through the items
    const recipeNode = this.state.data.map((recipe, index) => {
      return (<RecipeThumbnail recipe={recipe} key={index}/>)
    });
    
    return (<div>
              <SearchBar handleSearch={this.handleSearch} />
              <SortBar 
                sortOptions={sortOptions} 
                sortBy={this.state.search.sortBy}
                handleSort={this.handleSort} />
              <Sidebar 
                handleVideo={this.handleVideo}
                handleCheck={this.handleCheck}
                
                hasVideo={this.hasVideo}
                categories={this.state.categories}  
                equipments={this.state.equipments}  
                cuisines={this.state.cuisines}  
                
                getIngredients={this.getIngredients}

                onAppendIngredient={this.onAppend(this.selected_ingredients)}
                onAppendCuisine={this.onAppend(this.selected_cuisines)}
                onAppendEquipment={this.onAppend(this.selected_equipments)}
                
                onRemoveIngredient={this.onRemove(this.selected_ingredients)}
                onRemoveCuisine={this.onRemove(this.selected_cuisines)}
                onRemoveEquipment={this.onRemove(this.selected_equipments)}
                
                initDataCuisine={this.state.initDataCuisine}
                initDataEquipment={this.state.initDataEquipment}
                />
              <div className="container recipes">            
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
