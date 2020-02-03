<template>
  <v-app id="sandbox">
    <v-content>
      <v-container fluid p-2>
        <v-layout row>
          <v-flex sm2 xs5>
            <v-layout column>
              <v-card style="padding:0; height: 93vh; overflow-y: auto;">
                <div v-for="user in $store.getters.unseenCounter">
                  <div @click="openChat(user._id)" class="usersStyle">
                    <span>
                      {{ user.first_name }}
                    </span>
                    <div
                      v-if="user.count !== 0"
                      style="background: #ff8d8d; margin: 2px; float: right; border-radius: 6px;"
                    >
                      <span style="margin: 5px">
                        {{ user.count }}
                      </span>
                    </div>
                  </div>
                  <v-divider></v-divider>
                </div>
              </v-card>
            </v-layout>
          </v-flex>
          <v-flex ml-3 sm11 xs5>
            <v-layout column>
              <div v-if="clientId === ''">
                <span style="color: darkblue"
                  >choose contact to start chat</span
                >
              </div>
              <v-card v-else>
                <v-card-text
                  style="height: 82vh; overflow-y: auto; display: flex; flex-direction: column-reverse;"
                >
                  <div
                    v-if="this.$store.state.messageRecive.messages.length === 0"
                  >
                    <v-layout row>
                      <p
                        style="font-size: 50px; margin-left: 65vh;margin-bottom: 34vh"
                      >
                        Start chat
                      </p>
                    </v-layout>
                  </div>
                  <div
                    v-else
                    v-for="message in this.$store.state.messageRecive.messages"
                  >
                    <div
                      style="direction: rtl"
                      v-if="message.client_id === clientId"
                    >
                      <v-layout row>
                        <div class="display-talk-bubble">
                          <div
                            class="owner-talk-bubble tri-right round right-top"
                          >
                            <div class="message-style">
                              {{ message.text_message }}
                            </div>
                            <span
                              v-if="message.seen === false"
                              class="message-seen-style"
                              ><v-icon small>mdi-check</v-icon></span
                            >
                            <span
                              v-if="message.seen === true"
                              class="message-seen-style"
                              ><v-icon small>mdi-check-all</v-icon></span
                            >
                            <span class="message-time-style">{{
                              message.createdAt | moment('h:mm')
                            }}</span>
                          </div>
                        </div>
                      </v-layout>
                    </div>
                    <div v-else>
                      <v-layout row>
                        <div class="display-talk-bubble">
                          <div
                            class="client-talk-bubble tri-left round left-top"
                          >
                            <div class="message-style">
                              {{ message.text_message }}
                            </div>
                            <span class="message-time-style">{{
                              message.createdAt | moment('h:mm')
                            }}</span>
                          </div>
                        </div>
                      </v-layout>
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-layout row>
                    <v-layout column>
                      <v-text-field
                        v-model="message"
                        :append-outer-icon="message ? 'mdi-send' : ''"
                        outlined
                        dense
                        clear-icon="mdi-close-circle"
                        clearable
                        label="Message"
                        type="text"
                        @keyup.enter="sendMessagePressed(message)"
                        @click:append="toggleMarker"
                        @click:append-outer="sendMessagePressed(message)"
                        @click:prepend="changeIcon"
                        @click:clear="clearMessage"
                      ></v-text-field>
                    </v-layout>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      show: false,
      message: '',
      ownerId: '',
      clientId: '',
      unseenCounter: [],
      marker: true,
      iconIndex: 0,
      icons: [
        'mdi-emoticon',
        'mdi-emoticon-cool',
        'mdi-emoticon-dead',
        'mdi-emoticon-excited',
        'mdi-emoticon-happy',
        'mdi-emoticon-neutral',
        'mdi-emoticon-sad',
        'mdi-emoticon-tongue'
      ],
      data: {
        clientMassage: ''
      },
      users: [],
      usersRes: [],
      usersResponse: [],
      unseenResponse: [],
      messages: []
    }
  },
  methods: {
    ...mapActions([
      'getUsers',
      'getMessages',
      'unseenMessages',
      'sendMessages'
    ]),
    getUsersStatusWithTimeout() {
      const thisInFun = this
      setTimeout(() => {
        thisInFun.getUsersStatus()
      }, 1000)
    },
    getUsersStatus() {
      this.unseenMessages({ userRes: this.$store.getters.users })
    },
    openChat(id) {
      if (this.clientId === '' || id !== '') {
        this.clientId = id
      }
      this.getMessages({
        client_id: this.clientId
      })
      this.unseenMessages({ userRes: this.$store.getters.users })
    },
    getOwnerStatus() {
      this.ownerId = localStorage.getItem('clientId')
    },
    sendMessagePressed(message) {
      this.sendMessages({
        text_message: message,
        client_id: this.clientId
      })
      this.message = ''
      this.openChat(this.clientId)
      this.resetIcon()
    },
    refresh() {
      setInterval(() => {
        this.getUsers()
        this.getUsersStatusWithTimeout()
        this.openChat('')
      }, 1000)
    },

    // text box functions
    toggleMarker() {
      this.marker = !this.marker
    },
    sendMessage() {
      this.resetIcon()
      this.clearMessage()
    },
    clearMessage() {
      this.message = ''
    },
    resetIcon() {
      this.iconIndex = 0
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++
    }
  },
  mounted() {
    this.getOwnerStatus()
    this.refresh()
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex]
    }
  }
}
</script>

<style>
.round {
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
}
.client-talk-bubble {
  display: inline-block;
  position: relative;
  min-width: 200px;
  max-width: 600px;
  height: auto;
  background-color: #dcf8c6;
  margin: 10px;
}
.owner-talk-bubble {
  display: inline-block;
  position: relative;
  min-width: 200px;
  max-width: 600px;
  height: auto;
  background-color: #afd3ed;
  margin: 10px;
  float: right;
}
.display-talk-bubble {
  display: flex;
  flex-direction: column-reverse;
  text-align: right;
  margin: 0 14px;
}
.tri-left.border.left-top:before {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: -40px;
  right: auto;
  top: -8px;
  bottom: auto;
  border: 32px solid;
  border-color: #dcf8c6 transparent transparent transparent;
}
.tri-left.left-top:after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: -10px;
  right: auto;
  top: 0px;
  bottom: auto;
  border: 12px solid;
  border-color: #dcf8c6 transparent transparent transparent;
}
.tri-right.border.right-top:before {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  right: -40px;
  left: auto;
  top: -8px;
  bottom: auto;
  border: 32px solid;
  border-color: #666 transparent transparent transparent;
}
.tri-right.right-top:after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  right: -10px;
  left: auto;
  top: 0px;
  bottom: auto;
  border: 12px solid;
  border-color: #afd3ed transparent transparent transparent;
}
.message-style {
  padding: 10px 11px 5px 11px;
  color: #000;
}
.message-time-style {
  color: #00000073;
  direction: ltr;
  margin-right: 6px;
  font-size: 11px;
}

.message-seen-style {
  color: #00000073;
  direction: ltr;
  margin-right: 11px;
  font-size: 10px;
}
.usersStyle {
  padding: 10px;
}
.usersStyle:hover {
  cursor: pointer;
  background-color: #e7e7e7;
}
</style>
