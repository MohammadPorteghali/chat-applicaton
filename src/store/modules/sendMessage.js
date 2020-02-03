import * as types from '@/store/mutation-types'
import api from '@/services/api/messages'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  ownerownerMessages: state => state.ownerMessages
}

const actions = {
  sendMessages({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .sendMessages(payload)
        .then(response => {
          if (response.status === 200) {
            commit(types.OWNERMESSAGES, response.data.data)
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
  [types.OWNERMESSAGES](state, ownerMessages) {
    state.ownerMessages = ownerMessages
  }
}

const state = {
  ownerMessages: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
