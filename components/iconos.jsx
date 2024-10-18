import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa el icono

// Icono para principal
export const PrincipalIcon = ({ focused, color, size }) => {
  return <FontAwesome5 name="home" size={size} color={color} />;
};

// Icono panel
export const PanelIcon = ({ focused, color, size }) => {
  return (
    <MaterialIcons name="admin-panel-settings" size={size} color={color} />
  );
};

export const ClienteIcono = ({ focused, color, size }) => {
  return <Icon name="user-plus" color={color} size={size} />;
};

export const DeudoresIcono = ({ focused, color, size }) => {
  return <Icon name="credit-card" color={color} size={size} />;
};
