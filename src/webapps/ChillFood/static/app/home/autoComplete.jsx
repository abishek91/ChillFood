import React from 'react';
import {render} from 'react-dom';

export default class AutoComplete extends React.Component {
  constructor(props){
    super(props)
    this.initData = false;
  }
  getData(value, callback) {
    console.log(this.props.data)
    var filter_data = this.props.data.filter((c)=> c.text.toUpperCase().indexOf(value) >= 0)      
    callback(value,filter_data)
  }

  componentDidMount(){ 
    // console.log('prueba',this.refs.test)
    // input = this.refs.test.findById("multipleInput")
    const self = this;
    console.log('initData',  this.props.initData)
    const name = this.props.name;
    // const data = this.props.data;
    console.log("multipleInput-"+name, $("multipleInput-"+name));

    $(function() {
        
        const input_name = '#input-'+name
        const dropdown = '#dropdown-'+name
        const appender = '.appender'+name
        
        self.autocomplete = $(input_name).materialize_autocomplete({
            multiple: {
                enable: true,
                onExist: function (item) {
                    Materialize.toast('' + item.text + ' is already added!', 2000);
                },
                onAppend: self.props.onAppend,
                onRemove: self.props.onRemove,
            },
            appender: {
                el: appender,
                tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<%= item.text %>"><%= item.text %><i class="material-icons close">close</i></div>'
            },
            dropdown: {
                el: dropdown
            },
            getData: function(value,callback) {
                if (self.props.getData)
                    self.props.getData(value,callback)
                else
                    self.getData(value,callback)
            }
        });
        
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps)
  // }

  render() {
    const self = this;

    if (!self.initData && self.props.initData && self.props.initData.length) {
      self.props.initData.forEach(function(data){
        self.autocomplete.append(data);
      });
      self.initData = true;
    }

    const name = this.props.name;
    const input_name = "input-"+name
    const dropdown = 'dropdown-'+name
    const appender = 'appender'+name

    return(<div className="autocomplete" id="single">
                <div className="ac-input-a">
                    <input type="text" 
                           id={input_name}
                           placeholder={this.props.placeholder} 
                           data-activates={dropdown} 
                           data-beloworigin="true"
                     />
                </div>
                <div className={appender}></div>
                <ul id={dropdown} className="dropdown-content ac-dropdown"></ul>
            </div>)
  }
}