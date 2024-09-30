import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LudoboardScreen from '../screens/LudoboardScreen';
import {navigationRef} from '../helpers/NavigationUtils';
import {ModalPortal} from 'react-native-modals';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={() => ({
          headerShown: false,
        })}>
        <Stack.Screen
          name="LudoBoardScreen"
          options={{
            animation: 'fade',
          }}
          component={LudoboardScreen}></Stack.Screen>
        <Stack.Screen
          name="HomeScreen"
          options={{
            animation: 'fade',
          }}
          component={HomeScreen}></Stack.Screen>
        <Stack.Screen
          name="SplashScreen"
          options={{
            animation: 'fade',
          }}
          component={SplashScreen}></Stack.Screen>
      </Stack.Navigator>
      <ModalPortal />
    </NavigationContainer>
  );
};

export default Navigation;
