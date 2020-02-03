import axios from 'axios'

// getting all of messages
export default {
  getMessages(payload) {
    return axios.post('/api/message/text_message_receiving', payload)
  },

  // sending message with client_id and message's text
  sendMessages(payload) {
    return axios.post('/api/message/text_message_sending', payload)
  },

  // list of unseens messages
  unseenMessages() {
    return axios.get('/api/message/unseen_counter')
  }
}
