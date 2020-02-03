import { createStackNavigator, createAppContainer } from "react-navigation";
import UserScreen from './screens/UsersScreen'
import MessageScreen from './screens/MessagesScreen';

const RootStack = createStackNavigator({
        Users: {
            screen: UserScreen,
            navigationOptions: {
                header: null,
            },
        },
        Messages: {
            screen: MessageScreen,
            navigationOptions: {
                header: null,
            },
        },

    }
);
export default createAppContainer(RootStack)

