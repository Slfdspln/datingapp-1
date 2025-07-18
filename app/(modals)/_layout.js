import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerStyle: {
          backgroundColor: '#a085e9',
        },
        headerTintColor: '#fff',
      }}
    />
  );
}
