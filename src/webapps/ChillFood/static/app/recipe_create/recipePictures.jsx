import React from 'react';
import Dropzone from 'react-dropzone';
import { Row, Col, Slider, Slide, Icon } from 'react-materialize';

const default_pic = "/static/images/upload4.png"

export default class RecipePictures extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        files:[],
        image:'',
        current:0
      }

      this.onDrop = this.onDrop.bind(this);
    }

    onDrop(acceptedFiles, rejectedFiles) {
      const self = this;
      console.log('Accepted files: ', acceptedFiles);
      console.log('Rejected files: ', rejectedFiles);
      getSignedRequest(acceptedFiles[0],function (url) {
        self.setState((prevState) => {
          self.props.updatePicture(url);
          return {
            files:[{preview:url}]
          }
        })
      });
      
    }

    componentWillReceiveProps() {
      console.log(this.props)
      this.setState((prevState) => {
          return {
            files:[{preview:this.props.src}]
          }
        })
    }

    handleClick(value) {
      this.setState({
        current: value
      })
      console.log(value)
    }

    render() {
      let main_image = () => (<span></span>)
      let steps = []
      const src = this.props.src || default_pic;
      console.log(src)
      if (this.props.multi) {
        const item = this.state.files[this.state.current]
        main_image = () => (<img
                              className='recipe-pictures create'
                              src={item.preview}>
                            </img>)

        steps = this.state.files.map(function (item,step) {
          return (<i key={step} 
                    onClick={()=>this.handleClick(step)} 
                    className={'material-icons grey-text '+ (step == this.state.current ? 'text-lighten-1':'text-lighten-3')}>
                    lens
                  </i>)
        }.bind(this))
      }
      
      console.log(this.props)

      return (
        <Row>
          <Col s={6} className="center-align dropzone">
            <Dropzone accept="image/*" onDrop={this.onDrop} style={{'backgroundImage' : "url("+src+")"}}>
              <i className="material-icons left">mode_edit</i>
            </Dropzone>
          </Col>
          <Col s={6} className="center-align">
            {main_image()}
            <div className="hidden center-align">
              {steps}
            </div>
          </Col>
          
        </Row>
      );
    }
};

