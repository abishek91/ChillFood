import React from 'react';
import {render} from 'react-dom';
import {Row, Col, Input, Icon, Button, Dropdown, NavItem} from 'react-materialize';
import SearchBar from '../searchBar.jsx'
import Recipe from '../api/recipe.jsx'
import querystring from 'querystring';
import List from '../api/list.jsx'
import Preferences from '../api/preferences.jsx'
import RecipeThumbnail from './recipeThumbnail.jsx'
import AutoComplete from './autoComplete.jsx'

export default class SortBar extends React.Component { 
  render() {
    let sortBy = this.props.sortBy;
    const sortOptionsNode = () => {
      return this.props.sortOptions.map((option, index) => {
        return (<NavItem className="options" onClick={() => this.props.handleSort(option)} key={index}>
                {option.label}
              </NavItem>)
      });
    }
    return (<div>
              <Row className="slim white blue-text below z-depth-1">
                <Col s={9}className="">
                  
                </Col>
                <Col s={3} className="">

                  <Dropdown trigger={
                    <a className="name dropdown-button" data-activates="dropdown2">
                      Sort by: {sortBy.label}
                      <i className="material-icons">arrow_drop_down</i>
                    </a>
                  }>
                    {sortOptionsNode()}
                  </Dropdown> 
                </Col>
              </Row>
            </div>);
  }
}

