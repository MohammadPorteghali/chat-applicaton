import * as types from '@/store/mutation-types'
import api from '@/services/api/messages'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  messages: state => state.messages
}

const actions = {
  getMessages({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .getMessages(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.MESSAGES, response.data.data)
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
  [types.MESSAGES](state, messages) {
    state.messages = messages
  }
}

const state = {
  messages: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
