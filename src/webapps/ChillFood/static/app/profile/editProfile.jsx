import React from 'react';
import {Row, Icon, Modal, Button} from 'react-materialize';
import User from '../api/user.jsx'
import SearchBar from '../searchBar.jsx'
import RecipePictures from '../recipe_create/recipePictures.jsx'

export default class EditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: userName      
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handlePicChange = this.handlePicChange.bind(this);
  }

  componentWillMount(){ 
    const self = this;
    new User().me()
    .then(function (data) {
      self.setState(data)
    })
  }

  handlePicChange(url) {
    this.setState({
      photo: url
    })
  }

  handleNameChange (event)  {
    this.setState({ name: event.target.value });
  };

  handleBirthdateChange (event)  {
    this.setState({ birthdate: event.target.value });
  };

  handleBioChange (event)  {
    this.setState({ bio: event.target.value });
  };

  handleSave () {
    const self = this;
    new User().save(this.state)
    .then(function (data) {
      self.setState(data)
      Materialize.toast('Profile has been updated.',2000,'blue');

    })    
  }
  render() {
    const user = this.state;
    console.log(user.photo)
    return (
        <div>
          <SearchBar username={user.name} user_photo={user.photo} />
          <div className="form-signin">
            <h2>Edit Profile</h2>
            <Row>
              <RecipePictures src={user.photo} updatePicture={this.handlePicChange} />
            </Row>
            <Row>
              <label htmlFor="name">name</label>
              <input type="text" 
                    name="name" 
                    placeholder="name" 
                    value={user.name}
                    onChange={this.handleNameChange}
              />
            </Row>
            <Row>
              <label htmlFor="birthdate">birthdate</label>
              <input type="date" 
                    name="birthdate" 
                    placeholder="birthdate" 
                    value={user.birthdate}
                    onChange={this.handleBirthdateChange}
              />
            </Row>
            <Row>
              <label htmlFor="bio">bio</label>
              <textarea type="text" 
                    className="materialize-textarea"
                    name="bio" 
                    placeholder="bio" 
                    value={user.bio}
                    onChange={this.handleBioChange}
              ></textarea>
            </Row>
            <Row>
              <input type="hidden" 
                    name="photo" 
                    placeholder="photo" 
                    defaultValue={user.photo}
                    ref="photo"
              />
            </Row>
            <button className="right btn waves-effect waves-light blue" type="button" onClick={() => this.handleSave() } >
              Save
            </button>
          </div>
        </div>
    );
  }
}