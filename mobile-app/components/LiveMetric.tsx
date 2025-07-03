import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { Video as LucideIcon } from 'lucide-react-native';

interface LiveMetricProps {
  title: string;
  icon: LucideIcon;
  color: string;
  getValue: () => string;
  unit?: string;
  updateInterval?: number;
}

export function LiveMetric({ 
  title, 
  icon: Icon, 
  color, 
  getValue, 
  unit = '',
  updateInterval = 5000 
}: LiveMetricProps) {
  const [value, setValue] = useState(getValue());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setValue(getValue());
        setIsUpdating(false);
      }, 200);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [getValue, updateInterval]);

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={[styles.indicator, { backgroundColor: color }]} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }, isUpdating && styles.updating]}>
          {value}
        </Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6,
    minHeight: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginRight: 4,
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  updating: {
    opacity: 0.6,
  },
});