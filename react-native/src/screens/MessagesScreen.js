import React, {Component} from 'react';
import {FlatList, TouchableOpacity , StyleSheet, View} from 'react-native';
import {Container, Header, Left, Right, Button, Title, Body, Item, Input, Icon, Text, ListItem} from 'native-base';
import moment from 'moment'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'

export default class MessageScreen extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            client_id: '',
            client_name: '',
            text_message: '',
            page: ''
        }
    }
    componentDidMount() {
        this._isMounted = true;
        this.refresh();
        this.getClientId();
    }
    refresh = () =>  {
        setInterval(() => {
            this.getMessages();
        }, 500)
    };
    getClientId = () => {
        const { params } = this.props.navigation.state;
        if (this.clientId === '' || params.userId !== '') {
            this.setState({ client_id : params.userId, client_name: params.userName });
        }
    };
    getMessages = async () => {
        let data = {
            method: 'POST',
            body: JSON.stringify({
                "client_id": this.state.client_id
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization':'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kMSI6IndGc2xDNCIsImVtYWlsIjoiUmV6YUBnbWFpbC5jb20iLCJyYW5kMiI6IkxUbllFcyIsImlkIjoiNWQ5MzU1ZmY3NmNjODYxNDM0OTBlN2U4IiwicmFuZDMiOiJpcldFRTAiLCJpYXQiOjE1NzAyODk0ODUsImV4cCI6MTU5OTA4OTQ4NX0.d4C8i4XyzbA4HRGoDD4BN7c5QMcJixO_DW_BTYjQPz8'
            }
        };
        return fetch('http://192.168.1.15:4400/api/message/text_message_receiving/?page='+this.state.page, data)
            .then((response) => response.json())
            .then((responseJson) => {
                if (this._isMounted) {
                    if( this.state.messages.length !== responseJson.data.length ) {
                        // if ( this.state.messages.length === 0 ) {
                            this.setState({messages: responseJson.data});
                        }
                        // else {
                        //     this.state.messages.unshift(responseJson.data[0]);
                        // }
                    // }
                }
            }).catch((err) => {
                console.log("err: ",err)
            })
    };
    componentWillUnmount() {
        this._isMounted = false;
    }
    sendMessage = () => {
        if (this.state.text_message !== '') {
            let data = {
                method: 'POST',
                body: JSON.stringify({
                    "text_message": this.state.text_message,
                    "client_id": this.state.client_id
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kMSI6IndGc2xDNCIsImVtYWlsIjoiUmV6YUBnbWFpbC5jb20iLCJyYW5kMiI6IkxUbllFcyIsImlkIjoiNWQ5MzU1ZmY3NmNjODYxNDM0OTBlN2U4IiwicmFuZDMiOiJpcldFRTAiLCJpYXQiOjE1NzAyODk0ODUsImV4cCI6MTU5OTA4OTQ4NX0.d4C8i4XyzbA4HRGoDD4BN7c5QMcJixO_DW_BTYjQPz8'
                }
            };
            return fetch('http://192.168.1.15:4400/api/message/text_message_sending', data)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.state.text_message = ''
                }).catch((err) => {
                    console.log("err: ", err)
                })
        }
    };
    renderRow = ({item}) => {
        return (
            <View>
                {item.client_id === this.state.client_id ?
                    <View style={{alignItems: 'flex-end'}}>
                        <View style={[styles.ownerMessage, {backgroundColor: '#dcf8c6'}]}>
                            <Text style={{color: '#000'}}>{item.text_message}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.ownerTimeStyle}>{moment(item.createdAt).format('h:mm')}</Text>
                                <View style={{ marginLeft: 5 }}>
                                    {item.seen === false ?
                                        <Icon2 active name='check'
                                               size={15}
                                              style={{ marginTop: 6,color: '#007c18' }}
                                        />
                                    :
                                        <Icon2 active name='check-all'
                                               size={15}
                                               style={{ marginTop:6,color: '#007c18'}}
                                        />
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    :
                    <View  style={{alignItems: 'flex-start'}}>
                        <View style={[styles.clientMessage, {backgroundColor: '#cadfff'}]}>
                            <Text style={{color: '#000'}}>{item.text_message}</Text>
                            <Text style={styles.clientTimeStyle}>{moment(item.createdAt).format('h:mm')}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    };
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#0049ff' }}>
                    <Left>
                        <Button transparent onPress={()=>{
                            this.props.navigation.navigate('Users');
                            this.state.client_id = ''
                        }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                    <Title>{ this.state.client_name }</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={{ flex: 1, flexDirection: 'column-reverse'}}>
                    <FlatList
                        inverted
                        data={ this.state.messages }
                        renderItem={ this.renderRow }
                        keyExtractor={ item => item._id }
                        // onEndReached={ this.setState({ page  : this.state.page + 1 }) }
                        // onEndReachedThreshold={ 0.5 }
                    />
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#e7e7e7', }}>
                    <View style={ styles.inputStyle }>
                        <Item style={{ backgroundColor: '#fff', marginTop: 5, marginBottom: 5 }} rounded>
                            <Input onChangeText={(text_message) => this.setState({text_message})}
                                   value={this.state.text_message}
                                   placeholder='Message'
                            />
                        </Item>
                    </View>
                    <TouchableOpacity onPress={() => {
                        this.sendMessage();
                        this.setState({ text_message: '' })
                    }}>
                        <View style={ styles.sendButton }>
                            <Icon active name='arrow-up'
                                  style={{ color : '#fff' }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </Container>
        )
    };

}
const styles = StyleSheet.create({
    ownerMessage: {
        maxWidth: 150,
        padding: 10,
        marginBottom: 7,
        marginTop: 3,
        marginRight: 15,
        borderRadius: 15,
    },
    clientMessage: {
        maxWidth: 150,
        padding: 10,
        marginBottom: 7,
        marginTop: 3,
        marginLeft: 15,
        borderRadius: 15,
    },
    inputStyle: {
        justifyContent: 'flex-end',
        width: '83%',
        marginRight: 10,
        marginLeft: 10
    },
    sendButton: {
        alignItems: 'center',
        width: 33,
        height: 33,
        borderRadius: 44,
        marginTop: 15 ,
        marginRight: 17,
        backgroundColor: "#0049ff"
    },
    ownerTimeStyle: {
        color: '#007c18',
        textAlign: 'right',
        marginTop: 5,
        marginLeft: 5,
        fontSize: 11
    },
    clientTimeStyle: {
        color: '#0b006d',
        textAlign: 'right',
        marginTop: 5,
        marginLeft: 5,
        fontSize: 11
    }
});

export { MessageScreen }
