import React from 'react';
import {Row, Col, Input, Icon, Button} from 'react-materialize';
import querystring from 'querystring'

const sortOptions = [ {label:'time',value: 5},
                      {label:'tastiness',value: 4},
                      {label:'views',value: 1},
                      {label:'difficulty',value: 2},
                      {label:'calories',value: 3},
                      ]

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    console.log('g_sort_id',g_sort_by);
    
    let sort = sortOptions[0];
    for (var i in sortOptions) {
      if (sortOptions[i].value == g_sort_by) {
        sort = sortOptions[i];
      }
    }

    this.state = {
      search:  {
        text:'',
        userId: 0,
        sortBy: sort
      }
    };

    this.handleSearch = this.handleSearch.bind(this);

  }

  handleSort(value) {
    this.handleSearch(null,null,value);
     //Close  drop down
  }

  handleSearch(text, userId, sortBy) {
    // console.log(location);
    let search = this.state.search;

    if (text)
      search.text = text;
    if (sortBy)
      search.sortBy = sortBy;
    
    this.setState({
      search: search
    });

    console.log(window.location.pathname, location.hash);
    if (/^#\/(\?.*)?$/.test(location.hash)) {
      this.props.handleSearch(text, userId, sortBy)
    } else {
      console.log(this.search,querystring.stringify(search))
      window.location = '/#/?' + querystring.stringify(search);
    }
  }

  componentWillMount(){
    if (this.props.search)
      this.setState({
        search: this.props.search
      })
  }

  render() {

    const sortOptionsNode = sortOptions.map((option, index) => {
      return (<li className="options" onClick={() => this.handleSort(option)} key={index}>
                {option.label}
              </li>)
    });

    const static_files = '/static/';
    const user ={};

    let search = this.state.search;
    
    console.warn(search)
    // var profileLink = '/profile/' + this.props.cook.id;
    return (
      <div className="navbar-fixed">
        <ul id="dropdown1" className="dropdown-content">
          <li><a href="/logout"><i className="material-icons left">power_settings_new</i>Sign Out</a></li>                    
        </ul>

        <ul id="dropdown2" className="dropdown-content">
          {sortOptionsNode}
        </ul>

        <nav>
          <div className="nav-wrapper blue">
            <a className="brand-logo" href="/">
              <img alt="ChillFood" src={static_files + 'images/ChillFood-white.png'} className="logo"/>
            </a>

            <Buttons />
            <SearchForm text={search.text} handleSearch={this.handleSearch} />            
          </div>
          <Row className="slim white blue-text below z-depth-1">
              <Col s={3}className=""><span href="#test1">Filter #1</span></Col>
              <Col s={3}className=""><span className="" href="#test2">Filter #2</span></Col>
              <Col s={3}className=""><span className="" href="#test3">Filter #3</span></Col>
              <Col s={3}className="">
                <span className="name dropdown-button" 
                   data-activates="dropdown2">
                  Sort by: {search.sortBy.label}
                  <span className="material-icons   ">arrow_drop_down</span>
                </span>
              </Col>
            </Row>
        </nav>
      </div>
    );
  }
}


const Buttons = ({user}) => {
  return (<ul className="right hide-on-med-and-down">
            <li>
              <a href="/#/recipe/create">                
                <i className="material-icons">add</i>
              </a>
            </li>

            <li>
              <a className="name dropdown-button white-text right-align" data-activates="dropdown1">
                <img className="left user_photo z-depth-1" src={"/profile_image/"+userId}/>
                { userName }
                <i className="material-icons right">arrow_drop_down</i>
              </a>
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
    return (<form className="right col s6">
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
              </form>);  
  }
}


