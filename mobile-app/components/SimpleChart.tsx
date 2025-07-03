import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ChartDataPoint {
  label: string;
  value: number;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
  height?: number;
}

export function SimpleChart({ 
  data, 
  title, 
  color = '#10B981', 
  height = 100 
}: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = width - 80;
  const barWidth = (chartWidth - (data.length - 1) * 8) / data.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.chart, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 30);
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight, 
                      width: barWidth,
                      backgroundColor: color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: '100%',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  bar: {
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});