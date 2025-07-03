import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GlassCard } from './GlassCard';
import { Video as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  status: 'good' | 'warning' | 'critical';
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  onPress?: () => void;
}

export function StatusCard({ 
  title, 
  value, 
  icon: Icon, 
  status, 
  subtitle, 
  trend = 'stable',
  onPress 
}: StatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'critical':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  const TrendIcon = getTrendIcon();
  const statusColor = getStatusColor();

  return (
    <GlassCard style={styles.card} onPress={onPress} pressable={!!onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
          <Icon size={24} color={statusColor} />
        </View>
        <View style={[styles.trendContainer, { backgroundColor: `${getTrendColor()}15` }]}>
          <TrendIcon size={16} color={getTrendColor()} />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color: statusColor }]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 6,
    minHeight: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 6,
  },
  value: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 14,
  },
});