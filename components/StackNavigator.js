import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import CalenderScreen from '../screens/CalenderScreen';


export const AppStackNavigator = createStackNavigator({
    CalendarScreen:{
        screen : CalenderScreen,
        navigationOptions:{
            headerShown:true,
        }
    }
});