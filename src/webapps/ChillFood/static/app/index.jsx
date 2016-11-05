import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import { Router, Route, hashHistory } from 'react-router'

// const ListForm = ({addItem}) => {
//   // Input tracker
//   let input;

//   return (
//     <div className="row">
//       <input className="col s10" placeholder="Ingredient name" ref={node => {
//         input = node;
//       }} />
//       <button className="col s1 waves-effect waves-blue btn btn-flat" 
//       type="button" 
//       onClick={() => {
//         addItem(input.value);
//         input.value = '';
//       }}>
//         <i className="material-icons blue-text">add</i>
//       </button>
//     </div>
//   );
// };

// const Item = ({item, remove}) => {
  
//   // Each Todo
//   return (<li className="list-group-item row" onClick={() => {remove(item.id)}}>
//             <div className="col s1">{item.id}</div>
//             <div className="col s3">{item.ingredient.name}</div>
//             <div className="col s2">{item.quantity}</div>
//             <div className="col s2">{item.price}</div>
//             <div className="col s2">{item.display}</div>     

//             <input name={"form-"+item.id+"-id"} className="col s1 hidden" value={item.id}/>
//             <input name={"form-"+item.id+"-ingredient"} className="col s3 hidden" value={item.ingredient.name}/>
//             <input name={"form-"+item.id+"-quantity"} className="col s2 hidden" value={item.quantity}/>
//             <input name={"form-"+item.id+"-price"} className="col s2 hidden" value={item.price}/>
//             <input name={"form-"+item.id+"-display"} className="col s2 hidden" value={item.display}/> 
//           </li>);  
// }

// const ItemList = ({items, remove}) => {
//   // Map through the items
//   const itemNode = items.map((item) => {
//     console.log(item)
//     return (<Item item={item} key={item.id} remove={remove}/>)
//   });
//   return (<ul>{itemNode}</ul>);
// }

// const Title = () => {
//   return (
//     <div>
//        <div>
//           <h4>Ingredients</h4>
//        </div>
//     </div>
//   );
// }

// // Contaner Component
// // Todo Id
// window.id = 0;
// class ListApp extends React.Component{
//   constructor(props){
//     // Pass props to parent class
//     super(props);
//     // Set initial state
//     this.state = {
//       data: []
//     }
//   }
//   // Add todo handler
//   addItem(val){
//     if (!val) {
//       //TODO: Pretty Message
//       alert('Value is required');
//       return;
//     }
//     // Assemble data
//     const item = new RecipeIngredient(this.state.data.length,val);// {text: val, id: window.id++}
//     // Update data
//     this.state.data.push(item);
//     // Update state
//     this.setState({data: this.state.data});
//   }
//   // Handle remove
//   handleRemove(id){
//     // Filter all todos except the one to be removed
//     const remainder = this.state.data.filter((item) => {
//       if(item.id !== id) return item;
//     });
//     // Update state with filter
//     this.setState({data: remainder});
//   }

//   render(){
//     // Render JSX
//     return (
//       <div>
//         <Title />
//         <ItemList 
//           items={this.state.data} 
//           remove={this.handleRemove.bind(this)}
//         />
//         <ListForm addItem={this.addItem.bind(this)}/>        
//       </div>
//     );
//   }
// }

// // ========================================
// function RecipeIngredient(ingredient_id, ingredient_name, quantity, price, display) {
//   this.id = ingredient_id;
//   this.ingredient = {
//     id: ingredient_id,
//     name: ingredient_name
//   };
//   this.quantity = quantity;
//   this.price = price;
//   this.display = display;
// }

// render(
//   <RecipeDetails />,
//   document.getElementById('stuff')
// );


render((
  <Router history={hashHistory}>
    <Route path="/" component={RecipeDetails} />
    <Route path="/recipe" component={RecipeDetails} />
  </Router>
), document.getElementById('root'));