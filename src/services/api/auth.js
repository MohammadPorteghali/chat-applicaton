import axios from 'axios'

export default {
  userLogin(payload) {
    return axios.post('/api/users/sign_in', payload)
  }
}
