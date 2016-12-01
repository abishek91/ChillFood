import React from 'react';
import {Row, Col, Input, Icon, Button} from 'react-materialize';
import ReactStars from 'react-stars'
import Rating from 'react-rating'
import {Img} from './common.jsx'
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
  		var profileLink = '/profile/' + comment.user.id;
	  	commentRows.push(
	  			<Row key={++id}>
	        		<div className="profile-pic	left">
                        <Img className="profile-pic left" src={commenterProfileImageUrl} alt="recipe pic" />
                    </div>
	        		<div>
	        			<p>
	        				<a href={profileLink} className="profile-name">{comment.user.name}</a>
	        				<span className="date-time">{comment.date_time}</span>
	        			</p>
	  					<span>{comment.text}</span>
	  				</div>
	  			</Row>
	  			);
  	});
    return (
    	
        <span>
		     <div>	
		     	<Row>
		        <h4> Comments </h4>
		        </Row>
	        	<div className="left">
		        	<div className="left cook" >Difficulty&nbsp;&nbsp;&nbsp;</div>
		        	<Rating initialRate={parseFloat(this.props.difficulty)} readonly={Boolean(this.props.difficulty)}  
		        			 full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star" 
		        			 onClick={this.difficultyRating} fractions={2} />
	        	</div>
	        	<div>
		        	<div className="left tasty tastiness cook">Tastiness&nbsp;&nbsp;&nbsp;</div>
		        	<Rating initialRate={parseFloat(this.props.tastiness)} readonly={Boolean(this.props.tastiness)}
		        			 full="glyphicon glyphicon-star big-star" empty="glyphicon glyphicon-star-empty big-star"
		        			 onClick={this.tastinessRating} fractions={2} />
	        	</div>

		        <Row>
		    		<Input type="text" s={9} placeholder="Did you try it?" onChange={this.handleChange}>
		        		<Img className="profile-pic" src={userProfileImageUrl} alt="recipe pic" />
		    		</Input>
		    		<Button waves='light' className="blue-text btn btn-flat" onClick={this.handleSubmit}><Icon>add</Icon></Button>
		    	</Row>
		    </div>
    	<div>
        	{commentRows}
        </div>
        </span>
    );
  }
}