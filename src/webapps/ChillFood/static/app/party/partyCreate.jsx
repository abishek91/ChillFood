import React from 'react';
import {Row, Icon, Modal, Button} from 'react-materialize';
import Invitation from './invitation.jsx'
import User from '../api/user.jsx'
import Party from '../api/party.jsx'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default class CreateParty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disable:false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){ 
    const self = this;
    
    $(function() {
      $('.datepicker').pickadate({
        selectMonths: false, // Creates a dropdown to control month
        selectYears: false // Creates a dropdown of 15 years to control year
      });
            
      self.friends_input = $('#search_friends').materialize_autocomplete({
          multiple: {
              enable: true,
              onExist: function (item) {
                  Materialize.toast('Tag: ' + item.text + ' is already added!', 2000);
              }              
          },
          appender: {
              el: '.ac-friends',
              tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<%= item.text %>"><%= item.text %><i class="material-icons close">close</i></div>'
          },
          dropdown: {
              el: '#multiple-dropdown'
          },
          getData:(value, callback) => {
            new User().get(value)
            .then(function (data) {
              callback(value,data)              
            })
          }          
      });
    })

    this.refs.title.value = "The "+this.props.recipe_title+ " Party"
    const today = new Date()
    this.refs.date.value = monthNames[today.getMonth()]+' '+today.getDate()+', '+today.getFullYear()
  }
  
  handleClick(e) {

    if (this.friends_input.value.length == 0) {
      Materialize.toast('You must choose at least one person.');
      return;
    }

    console.log(this.refs.date)
    console.log(this.refs.date.value)
    console.log()
    const date = new Date(this.refs.date.value);
    const date_str = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() 
    let today = new Date()
    today.setHours(0,0,0,0,0)
    today = today-1
    console.log(today,date-1)
    if (date < today) {
      Materialize.toast('Sorry, your party cannot be in the past.');
      return;
    }

    this.setState({
      disable:true
    })

    let party = {
      name: this.refs.title.value,
      recipe: this.props.recipe_id,
      date: date_str,
      guests:this.friends_input.value.map((e)=>e.id),
    }
    console.log(this.refs.modal)
    new Party().create(party)
    .then(function (data) {
      console.log($("#modal"));
      $("#modal").closeModal();
      Materialize.toast('Your invitations has been sent.');
    }.bind(this))
    .catch(function (argument) {
      this.setState({
        disable:false
      })
    }.bind(this))
  }

  render() {
    
    return (
        <Modal
          id="modal"
          header="Invite Friends"
          fixedFooter
          trigger={
            Invitation()
          }
          actions={[
            <Button waves='light' className='blue white-text' disabled={this.state.disable} onClick={this.handleClick} flat>
              Invite
            </Button>,
            <Button waves='light' modal='close' flat>
              Close
            </Button>]}

          >
          <Row>
            <label htmlFor="title">Title</label>
            <input type="text" 
            name="title" 
            placeholder="Title" 
            ref="title"
            />
          </Row>
          <Row>
            <label htmlFor="title">When?</label>
            <input 
              className="datepicker"
              name="date" 
              ref="date"
            />
          </Row>
          <div className="autocomplete" id="multiple">
              <div className="ac-input">
                  <input type="text" id="search_friends" placeholder="Who do you want to invite?" data-activates="multiple-dropdown" data-beloworigin="true" />
              </div>
              <div className="ac-friends"></div>
              <ul id="multiple-dropdown" className="dropdown-content ac-dropdown"></ul>
              <input type="hidden" name="multipleHidden" />
          </div>
        </Modal>
    );
  }
}