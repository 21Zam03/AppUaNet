import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './inicio';
import SearchBar from './SearchBar';
import Search from './Search';
import MakePost from './MakePost';
import UserProfile from './UserProfile'

const Looktab = createStackNavigator();

export default function Navegacion1() {
    return(
        <Looktab.Navigator>
            <Looktab.Screen name='Inicio' component={Inicio} options={{ headerShown: false }}></Looktab.Screen>
            <Looktab.Screen name='Buscador' component={Search} options={{ headerTitle: props => <SearchBar {...props} /> }}></Looktab.Screen>
            <Looktab.Screen name='Postear' component={MakePost} options={{ headerTitle: "Crea una publicacion" }}></Looktab.Screen>
            <Looktab.Screen name='Perfil' component={UserProfile} options={{ headerTitle: "Korolova" }}></Looktab.Screen>
        </Looktab.Navigator>
    );
}