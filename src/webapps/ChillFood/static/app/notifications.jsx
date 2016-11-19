import React from 'react';
import {Button, NavItem, Dropdown, Badge} from 'react-materialize';

export default class Notifications extends React.Component {
  constructor() {
    super();    
    this.state = {
      notifications: []
    }
    this.readNotifications = this.readNotifications.bind(this);

  }

  componentDidMount() {
      let self = this;
      fetch('/notifications',
           {credentials: 'include'})
      .then(function(response) {
          return response.text();
        })
      .then(function (data) {
        self.setState({
          notifications: JSON.parse(JSON.parse(data).notifications)
        })
      })
    }
  
   readNotifications(unread) {
      let self = this;
      if(!unread)
        return
      fetch('/readNotifications',
          {credentials: 'include'})
      .then(function(response) {
          return response.text();
        })
      .then(function (data) {
        self.setState({
          notifications: JSON.parse(JSON.parse(data).notifications)
        })
      })      
   }

  render() {

    var notifications = [];
    var id = 0, unread = 0;;
    this.state.notifications.forEach(function(notification){
        if(!notification.fields.read)
            unread++;
        notifications.push(<NavItem key={++id}>{notification.fields.text}</NavItem>)
        notifications.push(<NavItem key={++id} divider />)
    })
    var unreadBubble = unread ? <div className="numberCircle"><span>{unread}</span></div> : null;
    return (
        <span className="right wide">
          <Dropdown trigger={
            <span>
             <Button floating large className='red' waves='light' icon='notifications' onClick={() => this.readNotifications(unread)} />
              {unreadBubble}
            </span>
          }>
          {notifications}
        </Dropdown> 
      </span>
    );
  }
}