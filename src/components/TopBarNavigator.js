import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Home from './Home';
import Video from './Video';
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
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { 
                    backgroundColor: 'white',
                    borderBottomWidth: 1, // Espesor del borde inferior
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
                        <Icon name="home" color={color} size={30} />
                    ),
                }}
            />
            <Tab.Screen
                name="Video"
                component={Video}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="play-circle" color={color} size={25} />
                    ),
                }}
            />
            <Tab.Screen
                name="Friendship"
                component={FriendShip}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="user-plus" color={color} size={25} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="bell" color={color} size={22} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};