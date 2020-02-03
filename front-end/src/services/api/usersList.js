import axios from 'axios'

export default {
  getUsers(params) {
    return axios.get('/api/users/list_users', {
      params
    })
  }
}
