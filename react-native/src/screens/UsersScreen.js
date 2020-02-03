import React, {Component} from 'react';
import { StyleSheet ,FlatList, TouchableOpacity, View } from 'react-native';
import { Container, Header,  List, ListItem, Text } from 'native-base';

export default class UserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            userRes: [],
            unseenCounter: []
        }
    }
    componentDidMount() {
        this.refresh();
    }
    getUsers = async () => {
        let data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization':'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kMSI6InpXMVNuTSIsImVtYWlsIjoiUmV6YUBnbWFpbC5jb20iLCJyYW5kMiI6ImJjNm9zdCIsImlkIjoiNWQ5MzU1ZmY3NmNjODYxNDM0OTBlN2U4IiwicmFuZDMiOiJ1V2RkMFciLCJpYXQiOjE1NzA2MDYxMjEsImV4cCI6MTU5OTQwNjEyMX0.3rxIwOQNSlh2mgVb3PpLI5bJawcWlKhcfK_9N3q_gBE'
            }
        };
        await fetch('http://192.168.1.15:4400/api/users/list_users', data)
            .then((response) => response.json())
                .then((responseJson) => {
                this.unseenMessages();
                if (responseJson.users !== this.state.userRes)
                this.setState({ userRes: responseJson.users });
                }).catch((err) => {
                console.log("err: ",err)
            })
    };
    unseenMessages = async () => {
        let data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization':'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kMSI6InpXMVNuTSIsImVtYWlsIjoiUmV6YUBnbWFpbC5jb20iLCJyYW5kMiI6ImJjNm9zdCIsImlkIjoiNWQ5MzU1ZmY3NmNjODYxNDM0OTBlN2U4IiwicmFuZDMiOiJ1V2RkMFciLCJpYXQiOjE1NzA2MDYxMjEsImV4cCI6MTU5OTQwNjEyMX0.3rxIwOQNSlh2mgVb3PpLI5bJawcWlKhcfK_9N3q_gBE'
            }
        };
        await fetch('http://192.168.1.15:4400/api/message/unseen_counter', data)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ unseenCounter : responseJson.data });
                let users = [];
                for(let i = 0; i < this.state.userRes.length; i++) {
                    users.push({
                        "_id": this.state.userRes[i]._id,
                        "first_name": this.state.userRes[i].first_name,
                        "last_name": this.state.userRes[i].last_name,
                        "email": this.state.userRes[i].email,
                        "phone_number": this.state.userRes[i].phone_number,
                        "count": 0
                    });
                    if (this.state.unseenCounter.length !== 0) {
                        for (let j = 0; j < this.state.unseenCounter.length; j++) {
                            if (this.state.userRes[i]._id === this.state.unseenCounter[j]._id) {
                                users[i].count = this.state.unseenCounter[j].count
                            }
                            if ((i + 1) === this.state.userRes.length && (j + 1) === this.state.unseenCounter.length) {
                                if (this.state.userRes !== users)
                                    this.setState({users: users})
                            }
                        }
                    } else if ((i + 1) === this.state.userRes.length) {
                        if (this.state.userRes !== users)
                            this.setState({users: users})
                    }
                }
            }).catch((err) => {
                console.log("err: ",err)
            })
    };
    refresh = () => {
        setInterval(() => {
            this.getUsers();
        }, 1000)
    };
    renderRow = ({item}) => {
        return (
            <View>
                <List>
                    <ListItem  onPress={()=>{
                        this.props.navigation.navigate('Messages',{
                            userId: item._id,
                            userName: item.first_name
                        });
                    }}>
                        <Text>{ item.first_name }</Text>
                         { item.count !== 0 ?
                            <View style={{ position: 'absolute', right: 10,borderRadius: 55,width: 20, backgroundColor: '#0049ff' }}>
                                <Text style={{ color: '#fff' }}>{ item.count }</Text>
                            </View>
                         :
                             <View>

                             </View>
                        }
                    </ListItem>
                </List>
            </View>
        )
    };
    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: '#0049ff' }}>
                    <Text style={{ color: '#fff', fontSize: 25, marginTop: 10 }}>
                        Chats
                    </Text>
                </Header>
                <FlatList
                    data={ this.state.users }
                    renderItem={ this.renderRow }
                    keyExtractor={ item => item._id }
                />
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e2dee0',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    texts: {
        fontSize: 30,
        color: '#ffffff',
    },
    header: {
        textAlign: 'left',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        fontSize: 30,
        color: '#ffffff',
    }
});
