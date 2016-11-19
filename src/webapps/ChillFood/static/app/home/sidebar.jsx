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
          <div className="option">
              <div className="autocomplete" id="multiple">
                  <div className="ac-inputCuisine">
                      <input type="text" id="multipleCuisineInput" placeholder="Which are your favorite cuisines?" data-activates="multipleCuisineDropdown" data-beloworigin="true" />
                  </div>
                  <div className="ac-cuisines"></div>
                  <ul id="multipleCuisineDropdown" className="dropdown-content ac-dropdown"></ul>
                  <input type="hidden" name="multipleHidden" />
              </div>
          </div>
        </li>
        <li><a className="subheader">Equipments</a></li>
        <li>
          <div className="option">
              <div className="autocomplete" id="multiple">
                  <div className="ac-inputEquipment">
                      <input type="text" id="multipleEquipmentInput" placeholder="What do you have in your kitchen?" data-activates="multipleEquipmentDropdown" data-beloworigin="true" />
                  </div>
                  <div className="ac-Equipments"></div>
                  <ul id="multipleEquipmentDropdown" className="dropdown-content ac-dropdown"></ul>
                  <input type="hidden" name="multipleHidden" />
              </div>
          </div>
        </li>
      </ul>
      <a href="#" id="menu" data-activates="slide-out" className="button-collapse show-on-large">
        <i className="material-icons">menu</i>
      </a>
    </div>);
  }
  
}