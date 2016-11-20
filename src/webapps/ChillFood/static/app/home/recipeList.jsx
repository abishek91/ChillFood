import React from 'react';
import {render} from 'react-dom';
import {Row, Col, Input, Icon, Button} from 'react-materialize';
import SearchBar from '../searchBar.jsx'
import Recipe from '../api/recipe.jsx'
import querystring from 'querystring';
import List from '../api/list.jsx'
import Preferences from '../api/preferences.jsx'
import RecipeThumbnail from './recipeThumbnail.jsx'
import AutoComplete from './autoComplete.jsx'
import SortBar from './sortBar.jsx'
import Sidebar from './sidebar.jsx'

const sortOptions = [ {label:'time',value: 5},
                      {label:'tastiness',value: 4},
                      {label:'views',value: 1},
                      {label:'difficulty',value: 2},
                      {label:'calories',value: 3},
                      ]

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props);   
    console.log('how often?') 
    this.state = {
      search: {
        sortBy: this.userDefault(),        
      },
      data: [],
      next: false,
      categories: [],
      equipments: [],
      cuisines: [],      
    }
    this.hasVideo = false;
    this.selected_categories=[];
    this.selected_cuisines=[];
    this.selected_equipments=[];
    this.recipe = new Recipe();
    
    this.handleVideo = this.handleVideo.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.load_posts = this.load_posts.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  handleSort(sortBy) {
    let self = this;
    // let search = this.state.search;
    this.state.search.sortBy = sortBy;
    console.log(this.state.search);
    // this.setState({
    //   search:search
    // });

    this.search()
  }

  userDefault() {    
    let sort = sortOptions[0];
    for (var i in sortOptions) {
      if (sortOptions[i].value == g_sort_by) {
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
    console.log(search)
    this.recipe.get(search.text,
      search.userId,
      search.sortBy ? search.sortBy.value : 0, //TODO: Remove condition
      this.selected_categories,
      this.selected_cuisines,
      this.selected_equipments,
      this.hasVideo,
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
    let selected_cuisines,selected_equipments;
    new Preferences().get()
    .then(function (preferences) {
      this.hasVideo = false; //Check how to update the fucking check
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
    selected_cuisines.forEach(function (item) {
      const cuisine = cuisines.filter(function (e) {
        return e.id == item;
      })
      console.log(cuisine,cuisines)
      self.cuisine_input.append({id:item,text:cuisine[0].text});
    });

    
    selected_equipments.forEach(function (item) {
      const equipment = equipments.filter(function (e) {
        return e.id == item;
      })
      self.equipment_input.append({id:item,text:equipment[0].text});
    });
  }

  //TODO: Move to she sidebar Component
  componentDidMount(){ 
    const self = this;
    // $(".button-collapse").sideNav();
    $("#menu").sideNav({
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      menuWidth: 370,
    });

    $(function() {
      self.cuisine_input = $('#multipleCuisineInput').materialize_autocomplete({
          multiple: {
              enable: true,
              onExist: function (item) {
                  Materialize.toast('Tag: ' + item.text + ' is already added!', 2000);
              },
              onAppend: function (cuisine) {
                self.selected_cuisines.push(cuisine.id);
                self.search();
              },
              onRemove: function (item) {
                var index = self.selected_cuisines.indexOf(item.id);
                if(index!=-1){
                   self.selected_cuisines.splice(index, 1);
                }
                self.search();
              }
          },
          appender: {
              el: '.ac-cuisines',
              tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<%= item.text %>"><%= item.text %><i class="material-icons close">close</i></div>'
          },
          dropdown: {
              el: '#multipleCuisineDropdown'
          },
          getData:(value, callback) => {
            var data = self.state.cuisines.filter((c)=> c.text.toUpperCase().indexOf(value) >= 0)      
            callback(value,data)
          }
          
      });
      
      // '<div class="chip" data-id="1" data-text="mexican">mexican<i class="material-icons close">close</i></div>'

      self.equipment_input = $('#multipleEquipmentInput').materialize_autocomplete({
          multiple: {
              enable: true,
              onExist: function (item) {
                  Materialize.toast('Tag: ' + item.text + ' is already added!', 2000);
              },
              onAppend: function (equipment) {
                self.selected_equipments.push(equipment.id);
                self.search();
              },
              onRemove: function (item) {
                var index = self.selected_equipments.indexOf(item.id);
                if(index!=-1){
                   self.selected_equipments.splice(index, 1);
                }
                self.search();
              }
          },
          appender: {
              el: '.ac-Equipments',
              tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<%= item.text %>"><%= item.text %><i class="material-icons close">close</i></div>'
          },
          dropdown: {
              el: '#multipleEquipmentDropdown'
          },
          getData:(value, callback) => {
            var data = self.state.equipments.filter((c)=> c.text.toUpperCase().indexOf(value) >= 0)      
            console.log(data);
            callback(value,data)
          }
          
      });
    });
  }

  render() {
    console.log(this.state.search.sortBy)
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
                hasVideo={this.hasVideo}
                handleVideo={this.handleVideo}
                categories={this.state.categories}  
                equipments={this.state.equipments}  
                cuisines={this.state.cuisines}  
                handleCheck={this.handleCheck}/>
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