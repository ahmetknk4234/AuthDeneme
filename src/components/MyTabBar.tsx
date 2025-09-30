import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#ccc' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, padding: 12, alignItems: 'center' }}
          >
            <Text style={{ color: isFocused ? colors.primary : colors.text, fontWeight: isFocused ? 'bold' : 'normal' }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

export default MyTabBar;
