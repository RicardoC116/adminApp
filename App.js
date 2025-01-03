// App.js

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
import CortesScreen from "./screens/content/corteScreen";
import DeudoresScreen from "./screens/content/deudoresScreen";
import DetallesDeudor from "./screens/content/detallesDeudoresScreen";
import HistorialCortesScreen from "./screens/content/historialCortes";
import DetallesCorte from "./screens/content/detallesCorte";
import CortesAgenteScreen from "./screens/content/corteAgente";
import VerClientesScreen from "./components/VerClientes";
import DetallesCliente from "./screens/content/DetallesClientes";
import EditarCliente from "./components/edicion";

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
      {/* Detales screen */}
      <Stack.Screen
        name="DetallesUsuarios"
        component={DetallesUsuarioScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Detalles del Usuario</Text>
          ),
        }}
      />
      {/* Cortes Screen */}
      <Stack.Screen
        name="Cortes"
        component={CortesScreen}
        options={{
          headerTitle: () => <Text style={styles.headerTitle}>Cortes</Text>,
        }}
      />
      {/* Ver deudores */}
      <Stack.Screen
        name="Deudores"
        component={DeudoresScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Lista de clientes</Text>
          ),
        }}
      />
      {/* DetallesDeudores */}
      <Stack.Screen
        name="DetallesDeudor"
        component={DetallesDeudor}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Detalles del cliente</Text>
          ),
        }}
      />
      {/* HistorialCorte */}
      <Stack.Screen
        name="HistorialCortes"
        component={HistorialCortesScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Historial de cortes</Text>
          ),
        }}
      />
      {/* DetallesCortes */}
      <Stack.Screen
        name="DetallesCorte"
        component={DetallesCorte}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Detalles de corte</Text>
          ),
        }}
      />
      {/* cortesAgente */}
      <Stack.Screen
        name="CortesAgente"
        component={CortesAgenteScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Cortes del agente</Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const ControlPanelStack = () => {
  return (
    <Stack.Navigator>
      {/* ControlPanel */}
      <Stack.Screen
        name="ControlPanelScreen"
        component={ControlPanelScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Panel de control</Text>
          ),
        }}
      />

      {/* Agregar Usuario */}
      <Stack.Screen
        name="AgregarUsuario"
        component={AgregarUsuarioScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Agregar Usuario</Text>
          ),
        }}
      />

      {/* Agegar Cliente */}
      <Stack.Screen
        name="AgregarCliente"
        component={AgregarDeudor}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Agregar cliente</Text>
          ),
        }}
      />

      {/* Ver Clientes */}
      <Stack.Screen
        name="VerClientes"
        component={VerClientesScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Ver clientes</Text>
          ),
        }}
      />

      {/* DetallesClientes */}
      <Stack.Screen
        name="DetallesClientes"
        component={DetallesCliente}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Detalles de cliente</Text>
          ),
        }}
      />

      {/* edicion */}
      <Stack.Screen
        name="EditarCliente"
        component={EditarCliente}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Editar cliente</Text>
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
