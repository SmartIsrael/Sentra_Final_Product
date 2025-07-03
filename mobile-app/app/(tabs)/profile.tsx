import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/GlassCard';
import { User, Settings, MapPin, Phone, Mail, Bell, Shield, CircleHelp as HelpCircle, LogOut, Camera, CreditCard as Edit, Smartphone, Wifi } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const userStats = [
    { label: 'Farm Size', value: '3.2 Ha', icon: MapPin },
    { label: 'Devices', value: '2 Active', icon: Smartphone },
    { label: 'Alerts Today', value: '3 New', icon: Bell },
    { label: 'Health Score', value: '94%', icon: Shield },
  ];

  const menuItems = [
    { icon: Settings, label: 'Account Settings', description: 'Manage your profile and preferences' },
    { icon: Bell, label: 'Notifications', description: 'Configure alert preferences' },
    { icon: Smartphone, label: 'Device Management', description: 'Manage connected field devices' },
    { icon: Wifi, label: 'Connectivity', description: 'Network and data usage settings' },
    { icon: Shield, label: 'Privacy & Security', description: 'Data protection and security' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact support' },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your sentra-bot account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled automatically by the auth state change
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#059669', '#10B981']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user?.name || 'Jean Claude Uwimana'}</Text>
                <Text style={styles.role}>Smallholder Farmer</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#06B6D4" />
                  <Text style={styles.location}>{user?.farmLocation || 'Nyagatare District, Rwanda'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Mail size={16} color="#6B7280" />
                <Text style={styles.contactText}>jc.uwimana@email.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Phone size={16} color="#6B7280" />
                <Text style={styles.contactText}>{user?.phoneNumber || '+250 788 123 456'}</Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Overview</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.statsContainer}
              contentContainerStyle={styles.statsContent}
            >
              {userStats.map((stat, index) => (
                <GlassCard 
                  key={index} 
                  style={styles.statCard}
                  onPress={() => console.log(`${stat.label} pressed`)}
                  pressable
                >
                  <View style={[styles.statIconContainer, { backgroundColor: '#10B98115' }]}>
                    <stat.icon size={20} color="#10B981" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </GlassCard>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <GlassCard onPress={() => console.log('Emergency contact pressed')} pressable>
              <TouchableOpacity style={styles.emergencyContact}>
                <View style={styles.emergencyIcon}>
                  <Phone size={20} color="#EF4444" />
                </View>
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyName}>Agricultural Extension Officer</Text>
                  <Text style={styles.emergencyNumber}>+250 788 654 321</Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {menuItems.map((item, index) => (
              <View key={index} style={styles.menuItemContainer}>
                <GlassCard 
                  style={styles.menuItem}
                  onPress={() => console.log(`${item.label} pressed`)}
                  pressable
                  variant="flat"
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.menuIcon, { backgroundColor: '#10B98115' }]}>
                        <item.icon size={20} color="#10B981" />
                      </View>
                      <View style={styles.menuItemText}>
                        <Text style={styles.menuItemTitle}>{item.label}</Text>
                        <Text style={styles.menuItemDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <Edit size={16} color="#9CA3AF" />
                  </View>
                </GlassCard>
              </View>
            ))}
          </View>

          <View style={styles.logoutContainer}>
            <GlassCard 
              style={styles.logoutCard}
              onPress={handleSignOut}
              pressable
              variant="flat"
            >
              <View style={styles.logoutContent}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>
                  {isLoading ? 'Signing Out...' : 'Sign Out'}
                </Text>
              </View>
            </GlassCard>
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Smartel sentra-bot v1.0.0</Text>
            <Text style={styles.copyrightText}>© 2025 Smartel Technologies</Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    marginBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#06B6D4',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#06B6D4',
    marginLeft: 4,
  },
  contactInfo: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 12,
  },
  statsContent: {
    paddingRight: 20,
  },
  statCard: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  emergencyNumber: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  callButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  callButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  menuItemContainer: {
    marginBottom: 6,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  logoutContainer: {
    marginBottom: 20,
  },
  logoutCard: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  bottomPadding: {
    height: 120,
  },
});