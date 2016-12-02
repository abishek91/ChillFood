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


export default class Sidebar extends React.Component { 
// const Sidebar = (props) => {
  constructor(props) {
    super(props);
    this.state = {
      hasVideo: props.hasVideo
    }
  }

  setDefaultHasVideo() {
    if (this.props.hasVideo)
      $("#hasVideo").attr('checked','');
    else
      $("#hasVideo").attr('checked');
  }
  
  handleChange(params) {
    console.log(params)
  }

  componentDidMount(){ 
    const self = this;
    $("#menu").sideNav({
      closeOnClick: false, 
      menuWidth: 370,
    });
  }

  render() {
    console.log(this.props.hasVideo, 'hasVideo')
    let my_switch = () => (<div></div>)
    if (this.props.hasVideo) {
      my_switch = () => (<Input name='hasVideo' 
                            id="hasVideo"
                            type='switch' 
                            checked
                            onLabel=' ' 
                            offLabel='Only recipes with video'
                            onChange={(e)=>this.props.handleVideo(e)}
                            />)
    } else {
      my_switch = () => (<Input name='hasVideo' 
                            id="hasVideo"
                            type='switch' 
                            onLabel=' ' 
                            offLabel='Only recipes with video'
                            onChange={(e)=>this.props.handleVideo(e)}
                            />)
    }
      
    // console.log(this.state)
    // let hasVideo = this.state.hasVideo;
    const handleCheck = this.props.handleCheck;

    const categories = this.props.categories.map(function(option, index) {
      return (<div className="option" key={index}>
                <Input id={'category'+index} 
                  type="checkbox" 
                  className="options" 
                  checked={option.selected}
                  value={option.id}
                  label={option.text}
                  onChange={()=> handleCheck(option) }/>
              </div>)
    });
    

    return  (<div>
      <ul id="slide-out" className="side-nav fixed">
        <li className="option">
          {my_switch()}
        </li>
        <li><a className="subheader">Categories</a></li>
        <li>
          {categories}
        </li>
        <li><a className="subheader">Ingredients</a></li>
        <li className="option">
          <AutoComplete 
            name="ingredient" 
            placeholder="What's in your fridge?"
            getData={this.props.getIngredients}
            onAppend={this.props.onAppendIngredient}
            onRemove={this.props.onRemoveIngredient}
             />             
        </li>
        <li><a className="subheader">Cuisines</a></li>
        <li className="option">
          <AutoComplete 
            name="cuisine" 
            placeholder="Which are your favorite cuisines?" 
            data={this.props.cuisines}
            onAppend={this.props.onAppendCuisine}
            onRemove={this.props.onRemoveCuisine}
            initData={this.props.initDataCuisine}
             />
        </li>
        <li><a className="subheader">Equipments</a></li>
        <li className="option">
          <AutoComplete 
            name="equipment" 
            placeholder="What do you have in your kitchen?"
            data={this.props.equipments}
            onAppend={this.props.onAppendEquipment}
            onRemove={this.props.onRemoveEquipment}
            initData={this.props.initDataEquipment}
             />             
        </li>        
      </ul>
      <a href="#" id="menu" data-activates="slide-out" className="button-collapse show-on-large">
        <i className="material-icons">menu</i>
      </a>
    </div>);
  }
  
}