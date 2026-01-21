import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface VariantAProps {
  email: string;
  userId: string;
  onLogout: () => Promise<void>;
  onTrackEvent: (event: string) => void;
}

export function VariantA({ email, userId, onLogout, onTrackEvent }: VariantAProps) {
  const handleViewDetails = () => {
    onTrackEvent('view_details_clicked');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>You are successfully authenticated</Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{userId}</Text>
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
