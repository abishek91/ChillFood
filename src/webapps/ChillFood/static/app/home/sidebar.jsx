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
    let hasVideo;
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

          <Input name='on' 
            type='switch' 
            defaultValue={this.props.hasVideo}
            onLabel=' ' 
            offLabel='Only recipes with video'
            onChange={(e)=>this.props.handleVideo(e)}
            />
          
        </li>
        <li><a className="subheader">Categories</a></li>
        <li>
          {categories}
        </li>
        <li><a className="subheader">Cuisines</a></li>
        <li>
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
        <li>
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