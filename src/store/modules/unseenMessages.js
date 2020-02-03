import * as types from '@/store/mutation-types'
import api from '@/services/api/messages'
// import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  unseenCounter: state => state.unseenCounter
}

const actions = {
  unseenMessages({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.unseenMessages().then(response => {
        if (response.status === 200) {
          const usersRes = payload.userRes
          const unseenCounter = response.data.data
          const users = []
          for (let i = 0; i < usersRes.length; i++) {
            users.push({
              _id: usersRes[i]._id,
              first_name: usersRes[i].first_name,
              last_name: usersRes[i].last_name,
              email: usersRes[i].email,
              phone_number: usersRes[i].phone_number,
              count: 0
            })
            if (unseenCounter.length !== 0) {
              for (let j = 0; j < unseenCounter.length; j++) {
                if (usersRes[i]._id === unseenCounter[j]._id) {
                  users[i].count = unseenCounter[j].count
                }
                if (
                  i + 1 === usersRes.length &&
                  j + 1 === unseenCounter.length
                ) {
                  if (usersRes !== users) {
                    this.users = users
                  }
                  console.log(users)
                }
              }
            } else if (i + 1 === usersRes.length) {
              if (usersRes !== users) {
                this.users = users
              }
              // console.log(users);
            }
          }
          commit(types.UNSEENMESSAGES, this.users)
          resolve()
        }
      })
      // .catch(error => {
      //     handleError(error, commit, reject)
      // })
    })
  }
}
const mutations = {
  [types.UNSEENMESSAGES](state, unseenCounter) {
    state.unseenCounter = unseenCounter
  }
}

const state = {
  unseenCounter: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
