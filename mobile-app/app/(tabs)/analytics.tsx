import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/GlassCard';
import { SimpleChart } from '@/components/SimpleChart';
import DetailModal from '@/components/ui/DetailModal';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Droplets,
  Thermometer,
  Sprout,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  const metrics = [
    {
      title: 'Crop Health Score',
      value: '94%',
      change: '+6.2%',
      trend: 'up' as const,
      icon: Sprout,
      color: '#10B981',
      description: 'Your crop health score reflects overall plant vigor and productivity.',
    },
    {
      title: 'Pest Detection Rate',
      value: '1.8%',
      change: '-1.2%',
      trend: 'down' as const,
      icon: Activity,
      color: '#EF4444',
      description: 'Percentage of crops where pests were detected during inspections.',
    },
    {
      title: 'Moisture Efficiency',
      value: '89%',
      change: '+4.1%',
      trend: 'up' as const,
      icon: Droplets,
      color: '#06B6D4',
      description: 'Efficiency of water usage compared to optimal moisture levels.',
    },
    {
      title: 'Temperature Stability',
      value: '96%',
      change: '+2.5%',
      trend: 'up' as const,
      icon: Thermometer,
      color: '#F59E0B',
      description: 'Consistency of temperature readings within target range.',
    },
  ];

  const chartData = [
    { label: 'Mon', value: 90 },
    { label: 'Tue', value: 92 },
    { label: 'Wed', value: 89 },
    { label: 'Thu', value: 95 },
    { label: 'Fri', value: 93 },
    { label: 'Sat', value: 96 },
    { label: 'Sun', value: 94 },
  ];

  const insights = [
    {
      title: 'Crop Health Improving',
      icon: TrendingUp,
      background: '#10B98115',
      color: '#10B981',
      content: 'Your crop health score has increased by 6.2% this week. Recent pest control and optimized irrigation are effective.',
    },
    {
      title: 'Irrigation Optimization',
      icon: Droplets,
      background: '#06B6D415',
      color: '#06B6D4',
      content: 'Consider reducing irrigation by 10% in the north field as moisture levels are 15% above optimal.',
    },
    {
      title: 'Pest Prevention',
      icon: Activity,
      background: '#F59E0B15',
      color: '#F59E0B',
      content: 'Upcoming weather favors pest activity. Increase monitoring and preventive treatments for vulnerable crops.',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <>
      <DetailModal
        isVisible={modalVisible}
        title={modalTitle}
        content={modalContent}
        onClose={() => setModalVisible(false)}
      />
      <LinearGradient colors={['#059669', '#10B981']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Analytics & Insights</Text>
            <TouchableOpacity style={styles.calendarButton}>
              <Calendar size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.periodContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.periodContent}
            >
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.periodTab,
                    selectedPeriod === period.id && styles.activePeriodTab,
                  ]}
                  onPress={() => setSelectedPeriod(period.id as 'week' | 'month' | 'quarter' | 'year')}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period.id && styles.activePeriodText,
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Metrics</Text>
              <View style={styles.metricsGrid}>
                {metrics.map((m, i) => (
                  <GlassCard
                    key={i}
                    style={styles.metricCard}
                    pressable
                    onPress={() => openModal(m.title, m.description)}
                  >
                    <View style={styles.metricHeader}>
                      <View
                        style={[
                          styles.metricIconContainer,
                          { backgroundColor: m.color + '15' },
                        ]}
                      >
                        <m.icon size={20} color={m.color} />
                      </View>
                      <View
                        style={[
                          styles.trendIcon,
                          {
                            backgroundColor:
                              m.trend === 'up' ? '#10B981' : '#EF4444',
                          },
                        ]}
                      >
                        {m.trend === 'up' ? (
                          <TrendingUp size={12} color="#FFFFFF" />
                        ) : (
                          <TrendingDown size={12} color="#FFFFFF" />
                        )}
                      </View>
                    </View>
                    <Text style={styles.metricValue}>{m.value}</Text>
                    <Text style={styles.metricTitle}>{m.title}</Text>
                    <Text
                      style={[
                        styles.metricChange,
                        {
                          color: m.trend === 'up' ? '#10B981' : '#EF4444',
                        },
                      ]}
                    >
                      {m.change} from last {selectedPeriod}
                    </Text>
                  </GlassCard>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Overview</Text>
              <GlassCard
                pressable
                onPress={() =>
                  openModal(
                    'Performance Overview',
                    'Detailed trend data for the selected period.'
                  )
                }
              >
                <SimpleChart
                  data={chartData}
                  title="Crop Health Trend"
                  color="#10B981"
                />
              </GlassCard>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Insights</Text>
              {insights.map((ins, i) => (
                <GlassCard
                  key={i}
                  style={styles.insightCard}
                  pressable
                  variant="flat"
                  onPress={() => openModal(ins.title, ins.content)}
                >
                  <View style={styles.insightHeader}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: ins.background },
                      ]}
                    >
                      <ins.icon size={20} color={ins.color} />
                    </View>
                    <Text style={styles.insightTitle}>{ins.title}</Text>
                  </View>
                  <Text style={styles.insightText}>{ins.content}</Text>
                </GlassCard>
              ))}
            </View>
            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  title: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#FFFFFF' },
  calendarButton: { padding: 8 },
  periodContainer: {
    marginBottom: 20,
  },
  periodContent: { 
    paddingHorizontal: 20,
    gap: 6,
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: 60,
    alignItems: 'center',
  },
  activePeriodTab: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  periodText: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#FFFFFF' },
  activePeriodText: { color: '#059669' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#FFFFFF', marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: (width - 60) / 2, marginBottom: 8, minHeight: 110 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  metricIconContainer: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  trendIcon: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#1F2937', marginBottom: 2 },
  metricTitle: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#6B7280', marginBottom: 2 },
  metricChange: { fontSize: 11, fontFamily: 'Inter-Regular' },
  insightCard: { marginBottom: 8 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  insightIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  insightTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#1F2937' },
  insightText: { fontSize: 13, fontFamily: 'Inter-Regular', color: '#6B7280', lineHeight: 18 },
  bottomPadding: { height: 120 },
});