import React, { useEffect } from 'react';
import {
  View,
  Text,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useABTestMetrics } from '../hooks/useABTestMetrics';
import { VariantA } from './HomeScreen_VariantA';
import { VariantB } from './HomeScreen_VariantB';

export default function HomeScreen() {
  const { user, testGroup, logout } = useAuth();
  const { trackEvent, flushMetrics } = useABTestMetrics('home_ui_test');

  // Track screen view on mount
  useEffect(() => {
    trackEvent('screen_viewed');
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Track logout event before logging out
              await flushMetrics();
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ],
    );
  };

  const handleTrackEvent = (event: string) => {
    trackEvent(event);
  };

  if (!user || !testGroup) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render based on test group variant
  if (testGroup.groupName === 'variant_b') {
    return (
      <VariantB
        email={user.email}
        userId={user.id}
        onLogout={handleLogout}
        onTrackEvent={handleTrackEvent}
      />
    );
  }

  // Default to variant A
  return (
    <VariantA
      email={user.email}
      userId={user.id}
      onLogout={handleLogout}
      onTrackEvent={handleTrackEvent}
    />
  );
}
