import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertItem } from '@/components/AlertItem';
import { GlassCard } from '@/components/GlassCard';
import { Filter, Search, Bell, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'all', label: 'All Alerts' },
    { id: 'critical', label: 'Critical' },
    { id: 'pest', label: 'Pest' },
    { id: 'disease', label: 'Disease' },
    { id: 'moisture', label: 'Moisture' },
  ];

  const alerts = [
    {
      id: '1',
      type: 'pest' as const,
      severity: 'high' as const,
      title: 'Severe Aphid Infestation',
      description: 'High population of aphids detected on maize plants. Immediate treatment required to prevent crop damage.',
      time: '30 minutes ago',
      location: 'Nyagatare District - Field A',
    },
    {
      id: '2',
      type: 'disease' as const,
      severity: 'medium' as const,
      title: 'Early Blight Detected',
      description: 'Signs of early blight fungal disease found on potato leaves. Apply fungicide treatment within 24 hours.',
      time: '1 hour ago',
      location: 'Gatsibo District - Zone C',
    },
    {
      id: '3',
      type: 'moisture' as const,
      severity: 'medium' as const,
      title: 'Low Soil Moisture',
      description: 'Soil moisture levels have dropped below optimal range. Consider adjusting irrigation schedule.',
      time: '2 hours ago',
      location: 'Kayonza District - Sector B',
    },
    {
      id: '4',
      type: 'pest' as const,
      severity: 'low' as const,
      title: 'Beneficial Insects Detected',
      description: 'Increased population of ladybugs observed. Natural pest control is working effectively.',
      time: '3 hours ago',
      location: 'Rwamagana District - Field D',
    },
    {
      id: '5',
      type: 'general' as const,
      severity: 'low' as const,
      title: 'Weather Alert',
      description: 'Light rain expected in the next 6 hours. Outdoor activities may be affected.',
      time: '4 hours ago',
      location: 'All Fields',
    },
  ];

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => 
        activeFilter === 'critical' 
          ? alert.severity === 'high'
          : alert.type === activeFilter
      );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <LinearGradient
      colors={['#059669', '#10B981']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Alerts & Notifications</Text>
            <Text style={styles.subtitle}>{filteredAlerts.length} active alerts</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Alert Summary */}
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.summaryText}>
                {alerts.filter(a => a.severity === 'high').length} Critical
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.summaryText}>
                {alerts.filter(a => a.severity === 'medium').length} Medium
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.summaryText}>
                {alerts.filter(a => a.severity === 'low').length} Low
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  activeFilter === filter.id && styles.activeFilterTab,
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter.id && styles.activeFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Alerts List */}
        <ScrollView 
          style={styles.alertsList}
          contentContainerStyle={styles.alertsContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredAlerts.length === 0 ? (
            <GlassCard style={styles.emptyState}>
              <Bell size={48} color="#6B7280" />
              <Text style={styles.emptyTitle}>No alerts found</Text>
              <Text style={styles.emptyText}>
                All systems are running smoothly for the selected filter.
              </Text>
            </GlassCard>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                type={alert.type}
                severity={alert.severity}
                title={alert.title}
                description={alert.description}
                time={alert.time}
                location={alert.location}
                onPress={() => {
                  console.log('Alert pressed:', alert.id);
                }}
              />
            ))
          )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchButton: {
    padding: 8,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 70,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activeFilterText: {
    color: '#059669',
  },
  alertsList: {
    flex: 1,
  },
  alertsContent: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 120,
  },
});