import { View, Text, TouchableOpacity} from "react-native";
import { useAuth } from "./AuthContext";

export default function Video () {
    const { handleLogout } = useAuth();

    return (
        <View>
            <Text>Videoss....</Text>
            <TouchableOpacity onPress={handleLogout}><Text>Cerrar Sesion</Text></TouchableOpacity>
        </View>
    );
}