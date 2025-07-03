import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusCard } from '@/components/StatusCard';
import { GlassCard } from '@/components/GlassCard';
import { AlertItem } from '@/components/AlertItem';
import { LiveMetric } from '@/components/LiveMetric';
import { 
  Sprout, 
  Thermometer, 
  Droplets, 
  Sun, 
  Camera, 
  Bell,
  TrendingUp,
  MapPin,
  Wifi,
  Battery,
  Signal
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [connectivity, setConnectivity] = useState(85);
  const [batteryLevel, setBatteryLevel] = useState(87);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const connectivityTimer = setInterval(() => {
      setConnectivity(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 10)));
    }, 8000);

    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - 0.1));
    }, 30000);

    return () => {
      clearInterval(connectivityTimer);
      clearInterval(batteryTimer);
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTemperature = () => {
    const base = 24;
    const variation = Math.sin(Date.now() / 60000) * 3;
    return (base + variation).toFixed(1);
  };

  const getMoisture = () => {
    const base = 68;
    const variation = Math.sin(Date.now() / 45000) * 5;
    return Math.round(base + variation).toString();
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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Muraho, Jean Claude</Text>
              <Text style={styles.date}>{formatDate(currentTime)}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(currentTime)}</Text>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Monitoring</Text>
            <View style={styles.metricsRow}>
              <LiveMetric
                title="Connectivity"
                icon={Wifi}
                color="#06B6D4"
                getValue={() => `${connectivity.toFixed(0)}%`}
                updateInterval={8000}
              />
              <LiveMetric
                title="Device Battery"
                icon={Battery}
                color="#10B981"
                getValue={() => `${batteryLevel.toFixed(0)}%`}
                updateInterval={30000}
              />
              <LiveMetric
                title="Temperature"
                icon={Thermometer}
                color="#F59E0B"
                getValue={getTemperature}
                unit="°C"
                updateInterval={5000}
              />
            </View>
          </View>

          {/* Farm Status Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Status</Text>
            <View style={styles.statusGrid}>
              <StatusCard
                title="Crop Health"
                value="94%"
                icon={Sprout}
                status="good"
                subtitle="Excellent condition"
                trend="up"
                onPress={() => console.log('Crop Health pressed')}
              />
              <StatusCard
                title="Soil Moisture"
                value={`${getMoisture()}%`}
                icon={Droplets}
                status="warning"
                subtitle="Monitor closely"
                trend="down"
                onPress={() => console.log('Soil Moisture pressed')}
              />
            </View>
            <View style={styles.statusGrid}>
              <StatusCard
                title="Weather"
                value="Sunny"
                icon={Sun}
                status="good"
                subtitle="Perfect conditions"
                trend="stable"
                onPress={() => console.log('Weather pressed')}
              />
              <StatusCard
                title="Field Coverage"
                value="2.3 Ha"
                icon={MapPin}
                status="good"
                subtitle="Fully monitored"
                trend="stable"
                onPress={() => console.log('Coverage pressed')}
              />
            </View>
          </View>

          {/* Device Status */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Field Devices</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <GlassCard onPress={() => console.log('Device pressed')} pressable>
              <View style={styles.deviceStatus}>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceIcon}>
                    <Camera size={24} color="#10B981" />
                  </View>
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>Field Monitor #1</Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={14} color="#06B6D4" />
                      <Text style={styles.deviceLocation}>Nyagatare District - Sector A</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.deviceStats}>
                  <View style={styles.statusIndicator}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Online</Text>
                  </View>
                  <Text style={styles.batteryText}>Battery: {batteryLevel.toFixed(0)}%</Text>
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Recent Alerts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Alerts</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <AlertItem
              type="pest"
              severity="medium"
              title="Aphid Detection"
              description="Early signs of aphid infestation detected in maize crops. Immediate action recommended."
              time="1 hour ago"
              location="Nyagatare - Field B"
              onPress={() => console.log('Aphid alert pressed')}
            />

            <AlertItem
              type="moisture"
              severity="low"
              title="Irrigation Complete"
              description="Soil moisture levels are optimal after recent irrigation cycle."
              time="3 hours ago"
              location="Gatsibo - Zone C"
              onPress={() => console.log('Irrigation alert pressed')}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <GlassCard 
                style={styles.actionCard} 
                onPress={() => console.log('Manual Scan pressed')}
                pressable
                variant="elevated"
              >
                <Camera size={32} color="#10B981" />
                <Text style={styles.actionText}>Manual Scan</Text>
              </GlassCard>
              
              <GlassCard 
                style={styles.actionCard}
                onPress={() => console.log('View Analytics pressed')}
                pressable
                variant="elevated"
              >
                <TrendingUp size={32} color="#06B6D4" />
                <Text style={styles.actionText}>View Analytics</Text>
              </GlassCard>
            </View>
          </View>

          {/* Bottom Padding for Tab Bar */}
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
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  deviceStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#06B6D4',
    marginLeft: 4,
  },
  deviceStats: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  batteryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginTop: 8,
  },
  bottomPadding: {
    height: 120,
  },
});