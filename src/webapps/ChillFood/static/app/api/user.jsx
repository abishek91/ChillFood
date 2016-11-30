/*
 * lists.jsx - Handle requests to the /api/lists
 */
import querystring from 'querystring'
import {get, post} from './api.jsx'

export default class User {
  get(name) {
    let self = this;
    return get('/api/user?' + querystring.stringify({name:name}))    
  }

  me() {
    return get('/api/edit_profile')
  }

  save(body) {
    return post('/api/edit_profile',body)
  }
}
 