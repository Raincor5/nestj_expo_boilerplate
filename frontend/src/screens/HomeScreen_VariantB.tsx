import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface VariantBProps {
  email: string;
  userId: string;
  onLogout: () => Promise<void>;
  onTrackEvent: (event: string) => void;
}

export function VariantB({ email, userId, onLogout, onTrackEvent }: VariantBProps) {
  const handleCopyUserId = () => {
    onTrackEvent('copy_userid_clicked');
  };

  const handleShareProfile = () => {
    onTrackEvent('share_profile_clicked');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <Text style={styles.headerSubtitle}>Variant B - New UI Design</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{email.charAt(0).toUpperCase()}</Text>
          </View>
          
          <Text style={styles.emailDisplay}>{email}</Text>
          
          <View style={styles.idContainer}>
            <Text style={styles.idLabel}>ID:</Text>
            <Text style={styles.idValue}>{userId.substring(0, 8)}...</Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopyUserId}>
            <Text style={styles.actionButtonText}>Copy ID</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#0f0f0f',
    padding: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  emailDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  idValue: {
    fontSize: 12,
    color: '#0a84ff',
    fontFamily: 'Courier',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
