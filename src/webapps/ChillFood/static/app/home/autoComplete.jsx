import React from 'react';
import {render} from 'react-dom';

export default class AutoComplete extends React.Component {
  getData(value, callback) {
    console.log(this.props.data)
    var filter_data = this.props.data.filter((c)=> c.text.toUpperCase().indexOf(value) >= 0)      
    console.log(data,filter_data)
    callback(value,filter_data)
  }

  componentDidMount(){ 
    // // console.log('prueba',this.refs.test)
    // // input = this.refs.test.findById("multipleInput")
    // const name = this.props.name;
    // // const data = this.props.data;
    // console.log("multipleInput-"+name,$("multipleInput-"+name));
    // var multiple = $("multipleInput-"+name).materialize_autocomplete({
    //     multiple: {
    //         enable: true,
    //         onExist: function (item) {
    //             Materialize.toast('Tag: ' + item.text + ' is already added!', 2000);
    //         },
    //         onAppend: function (test,a) {
    //           console.log('b',test,a)
    //         }
    //     },
    //     appender: {
    //         el: '.ac-list-'+name,
    //         tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<%= item.text %>"><%= item.text %><i class="material-icons close">close</i></div>'
    //     },
    //     dropdown: {
    //         el: '#multipleDropdown-'+name
    //     },
    //     getData: this.getData        
    // });
    
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  render() {
    const name = this.props.name;

    return(<div className="option">
            <div className="autocomplete" id="multiple">
                <div className="ac-input">
                    <input type="text" id={"multipleInput-"+name} placeholder={this.props.placeholder} data-activates="multipleDropdown" data-beloworigin="true" />
                </div>
                <div className={"ac-list-"+name} ></div>
                <ul id={"multipleDropdown-"+name} className="dropdown-content ac-dropdown"></ul>
                <input type="hidden" name="multipleHidden" />
            </div>
          </div>)
  }
}