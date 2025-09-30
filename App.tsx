import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './src/screens/MainPage';
import Sepetim from './src/screens/Sepetim';
import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import MyTabBar from './src/components/MyTabBar';
import { UserProvider } from './src/context/userContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <UserProvider>
      <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
        <Tab.Screen
          name="Anasayfa"
          component={MainPage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Sepetim"
          component={Sepetim}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profil"
          component={Profile}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </UserProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
