import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text } from "react-native";
import LoginScreen from "./screens/loginScreen";
import PrincipalScreen from "./screens/principalScreen";
import ControlPanelScreen from "./screens/controlPanelScreen";
import { PanelIcon, PrincipalIcon } from "./components/iconos";
import AgregarUsuarioScreen from "./components/AgregarUsuario";
import DetallesUsuarioScreen from "./screens/DetallesUsuarioScreen";
import AgregarDeudor from "./components/AgregarCliente";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PrincipalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PrincipalScreen"
        component={PrincipalScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>Usuarios</Text>,
        }}
      />
      <Stack.Screen
        name="DetallesUsuarios"
        component={DetallesUsuarioScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Detalles del Usuario</Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const ControlPanelStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ControlPanelScreen"
        component={ControlPanelScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Panel de control</Text>
          ),
        }}
      />
      <Stack.Screen
        name="AgregarUsuario"
        component={AgregarUsuarioScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Agregar Usuario</Text>
          ),
        }}
      />
      <Stack.Screen
        name="AgregarCliente"
        component={AgregarDeudor}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Agregar cliente</Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Principal") {
            return (
              <PrincipalIcon focused={focused} color={color} size={size} />
            );
          } else if (route.name === "ControlPanel") {
            return <PanelIcon focused={focused} color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Principal"
        component={PrincipalStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ControlPanel"
        component={ControlPanelStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {() => <LoginScreen setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
