import * as types from '@/store/mutation-types'
import api from '@/services/api/usersList'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  users: state => state.users
}

const actions = {
  getUsers({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getUsers(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.USERS, response.data.users)
            resolve()
          }
        })
        .catch(error => {
          handleError(error, commit, reject)
        })
    })
  }
}
const mutations = {
  [types.USERS](state, users) {
    state.users = users
  }
}

const state = {
  users: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
