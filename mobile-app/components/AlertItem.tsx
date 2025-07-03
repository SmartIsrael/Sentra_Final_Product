import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GlassCard } from './GlassCard';
import { TriangleAlert as AlertTriangle, Bug, Droplets, Clock, ChevronRight, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AlertItemProps {
  type: 'pest' | 'disease' | 'moisture' | 'general';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  time: string;
  location: string;
  onPress?: () => void;
}

export function AlertItem({ type, severity, title, description, time, location, onPress }: AlertItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'pest':
        return Bug;
      case 'disease':
        return AlertTriangle;
      case 'moisture':
        return Droplets;
      default:
        return Clock;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'pest':
        return '#EF4444';
      case 'disease':
        return '#F59E0B';
      case 'moisture':
        return '#06B6D4';
      default:
        return '#6B7280';
    }
  };

  const Icon = getIcon();

  return (
    <GlassCard style={styles.container} onPress={onPress} pressable={!!onPress} variant="flat">
      <View style={styles.alertContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor()}15` }]}>
          <Icon size={20} color={getTypeColor()} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor() }]}>
              <Text style={styles.severityText}>{severity.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
          <View style={styles.meta}>
            <View style={styles.locationRow}>
              <MapPin size={12} color="#06B6D4" />
              <Text style={styles.location} numberOfLines={1}>{location}</Text>
            </View>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    marginRight: 6,
  },
  severityBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  severityText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  location: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#06B6D4',
    marginLeft: 3,
  },
  time: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});