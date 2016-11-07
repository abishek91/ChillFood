import React from 'react';
import {Row, Col, Input, Icon, Button} from 'react-materialize';
import ReactStars from 'react-stars'
import Rating from 'react-rating'

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.difficultyRating = this.difficultyRating.bind(this);
    this.tastinessRating = this.tastinessRating.bind(this);
    this.state = {value: null};
  }

  handleChange(event) {
    	this.setState({value: event.target.value});
  }

  handleSubmit(event) {
  		this.props.onNewComments(this.state.value);
  }	

  difficultyRating(rating) {
  		this.props.onNewDifficultyRating(rating);
  }	
  tastinessRating(rating) {
  		this.props.onNewTastinessRating(rating);

  }	

  render() {
	var id = 0;
  	var commentRows = [];
  	var userProfileImageUrl = '/profile_image/' + userId;
  	this.props.comments.forEach(function(comment){
	  	var commenterProfileImageUrl = '/profile_image/' + comment.user.id;
	  	commentRows.push(
	  			<div key={++id}>
	        		<div className="profile-pic	left"><img className="profile-pic left" src={commenterProfileImageUrl} alt="recipe pic" /></div>
	        		<div>
	        			<p>
	        				<span className="profile-name">{comment.user.name}</span>
	        				<span className="date-time">{comment.date_time}</span>
	        			</p>
	  					<span>{comment.text}</span>
	  				</div>
	  			</div>
	  			);
  	});
    return (
    	
        <span>
		     <div>
		     	<Row>
		        <img height="40" width="40" src="/static/images/comments-icon.png" alt="clock" />
		        <span className="comments-title"> Comments </span>
		        </Row>
	        	<div className="left">
		        	<div className="left star" >Difficulty2</div>
		        	<Rating initialRate={parseFloat(this.props.difficulty)} readonly={Boolean(this.props.difficulty)}  
		        			 full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star" 
		        			 onClick={this.difficultyRating} fractions={2} />
	        	</div>
	        	<div>
		        	<div className="left tasty star">Tastiness</div>
		        	<Rating initialRate={parseFloat(this.props.tastiness)} readonly={Boolean(this.props.tastiness)}
		        			 full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star"
		        			 onClick={this.tastinessRating} fractions={2} />
	        	</div>

		        <Row>
		    		<Input type="text" s={9} placeholder="Did you try it?" onChange={this.handleChange}>
		        		<img className="profile-pic" src={userProfileImageUrl} alt="recipe pic" />
		    		</Input>
		    		<Button className="submit" waves='light' onClick={this.handleSubmit}>Submit</Button>
		    	</Row>
		    </div>
    	<div>
        	{commentRows}
        </div>
        </span>
    );
  }
}