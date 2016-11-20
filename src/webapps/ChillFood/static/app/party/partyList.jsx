import React from 'react';
import {render} from 'react-dom';
import {Row, Col, Input, Icon, Button, Collapsible,CollapsibleItem} from 'react-materialize';
import SearchBar from '../searchBar.jsx'
import List from '../api/list.jsx'
import Party from '../api/party.jsx'

export default class PartyList extends React.Component {
  constructor(props) {
    super(props);   
    this.state = {
      data:[]
    }
    this.api = new Party();
    this.load_more = this.load_more.bind(this);    
  }

  load_more() {
    this.api.load_more()
    .then(function (data) {
      console.log(data)

      this.setState((prevState, props) => {
        return {
          data: prevState.data.concat(data.data),
          next: !!(data.next)
        }
      })
    }.bind(this))
  }

  componentWillMount() {
    this.api.get()
    .then(function (data) {
      this.setState({
        data:data.data,
        next: !!(data.next)
      })
    }.bind(this))
  }

  guests(data) {
    return data.map(function(item,index) {
      
      let status = {color:'grey',text:'Invited'}

      if (item.status == 1) {
        status = {color:'blue',text:'Attending'}
      }

      if (item.status == -1) {
        status = {color:'red',text:'No attending'}
      }


      return (<li key={index}>
                {item.user.name}
                <span className={"text new badge " + status.color}>{status.text}</span>
              </li>)
    });
  }
  
  render() {
    

    // Map through the items
    const items = this.state.data.map((item, index) => {
      return (<CollapsibleItem header={item.name} icon='people'  key={index} >
                <Row>
                  <Col s={11} className="right-align grey-text">
                    {item.date}
                  </Col>
                </Row>
                <Row>
                  <Col s={10} offset='s1'>
                  <ul>
                    {this.guests(item.guests)}
                  </ul>
                  </Col>
                </Row>
              </CollapsibleItem>)
    });
    
    return (<div>
              <SearchBar handleSearch={this.handleSearch} />
              <div className="container">            
                  <div className="progress">
                        <div className="indeterminate"></div>
                  </div>  
                  <Collapsible popout accordion={true}>
                    {items}
                  </Collapsible>
                  <div className={"center-align " + (this.state.next ? '':'hidden')}>
                      <button id="next" 
                              type="button" 
                              onClick={()=>this.load_more()}
                              className="waves-effect waves-blue btn btn-flat">
                              load more...
                      </button>
                  </div>
              </div>
            </div>);
  }
}
