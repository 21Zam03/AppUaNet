import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from './Home';
import Chats from './Chats';
import FriendShip from './Friendship';
import Notification from './Notification';
import Account from './Account';

const Tab = createMaterialTopTabNavigator();

export default function TopBarNavigation() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: '#FF9F43',
                tabBarInactiveTintColor: 'black',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { 
                    backgroundColor: 'white',
                    borderBottomWidth: 0, // Espesor del borde inferior
                    borderBottomColor: '#F5F5EC', // Color del borde inferior
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#C9DB10', // Color del indicador de la tab activa
                },
                tabBarShowLabel: false
                }
            }
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon2 name="home" color={color} size={25} />
                    ),
                }}
            />
            <Tab.Screen
                name="News"
                component={Chats}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon2 name="message1" color={color} size={20} />
                    ),
                }}
            />
            <Tab.Screen
                name="Friendship"
                component={FriendShip}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon2 name="adduser" color={color} size={22} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon2 name="bells" color={color} size={22} />
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon3 name="menu" color={color} size={22} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};