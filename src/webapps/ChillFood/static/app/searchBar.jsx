import React from 'react';
import {Row, Col, Input, Icon, Button, NavItem, Dropdown, Badge} from 'react-materialize';
import querystring from 'querystring'
import Notifications from './notifications.jsx'

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      text: props.text
    };
    console.log('a',this.state)
    this.handleSearch = this.handleSearch.bind(this);

  }

  handleSearch(text) {
    // console.log(location);
    this.setState({
      text: text
    });

    if (/^#\/(\?.*)?$/.test(location.hash)) {
      this.props.handleSearch(text)
    } else {
      window.location = '/#/?' + querystring.stringify(search);
    }
  }
  
  componentWillMount(){
    if (this.props.text)
      this.setState({
        text: this.props.text
      })    
  }

  render() {
    const static_files = '/static/';
    const user ={};

    return (
      <div>
        <div className="navbar-fixed">
               

          <nav>
            <div className="nav-wrapper blue">
              <a className="brand-logo" href="/">
                <img alt="ChillFood" src={static_files + 'images/ChillFood-white.png'} className="logo"/>
              </a>

              <Buttons />
              <Notifications />

              <SearchForm text={this.state.text} handleSearch={this.handleSearch} /> 

            </div>            
          </nav>           
        </div>    
      </div>
    );
  }
}


const Buttons = ({user}) => {
    var profileLink = '/#/profile/' + userId;

  return (<ul className="right hide-on-med-and-down">
            <li>
              <a href="/#/recipe/create">                
                <i className="material-icons">add</i>
              </a>
            </li>
            <li>
             <Dropdown trigger={
             <a className="name dropdown-button" data-activates="dropdown1">{userName}<i className="material-icons right">arrow_drop_down</i></a>
          }>
           <NavItem href={profileLink}><i className="material-icons left">perm_identity</i>Profile</NavItem>
           <NavItem href="/logout"><i className="material-icons left">power_settings_new</i>Sign Out</NavItem>
        </Dropdown>     
        </li>
          </ul>);  
}

class SearchForm extends React.Component {
// const SearchForm = ({text, handleSearch}) => {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  handleSearch(text) {
    let self = this;
    clearInterval(self.interval)
    self.interval = setTimeout(() => self.props.handleSearch(text), 500);
    this.setState({text:text})
  }

  render() {
    return (
      <span><form className="right col s6">
      
                <div className="input-field">
                  <input id="search" 
                    type="search" 
                    value={this.state.text} 
                    onChange={(e) => this.handleSearch(e.target.value)} 
                    required/>

                  
                  <label htmlFor="search">
                    <i className="material-icons">search</i>

                  </label>
                  <i className="material-icons">close</i>
                </div>
              </form>
        </span> );  
  }
}

