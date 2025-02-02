import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa el icono
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";

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

export const ImprimirIcono = ({ focused, color, size }) => {
  return <AntDesign name="printer" size={size} color={color} />;
};

export const exitIcon = ({ focused, color, size }) => {
  return (
    <MaterialCommunityIcons name="exit-to-app" size={size} color={color} />
  );
};

export const VerClientesIcono = ({ focused, color, size }) => {
  return <Fontisto name="persons" size={size} color={color} />;
};

export const ClientesIcono = ({ focused, color, size }) => {
  return (
    <FontAwesome6 name="person-circle-question" size={size} color={color} />
  );
};

export const RenovacionIcono = ({ focused, color, size }) => {
  return <FontAwesome5 name="history" size={size} color={color} />;
};

export const DiaIcono = ({ focused, color, size }) => {
  return (
    <MaterialCommunityIcons name="calendar-outline" size={size} color={color} />
  );
};

// exportar icono de calendarWeek de fontAwasome5
export const SemanaIcono = ({ focused, color, size }) => {
  return (
    <MaterialCommunityIcons
      name="calendar-range-outline"
      size={size}
      color={color}
    />
  );
};
