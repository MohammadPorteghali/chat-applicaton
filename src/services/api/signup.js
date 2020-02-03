import axios from 'axios'

export default {
  userSignUp(payload) {
    return axios.post('/api/users/sign_up', payload)
  }
}
