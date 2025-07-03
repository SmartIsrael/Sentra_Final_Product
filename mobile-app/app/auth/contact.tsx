import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, MapPin, Users, Headphones } from 'lucide-react-native';

export default function ContactScreen() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const contactMethods = [
    {
      id: 'phone',
      icon: Phone,
      title: 'Call Support',
      subtitle: 'Speak directly with our team',
      value: '+250 788 123 456',
      action: () => handlePhoneCall('+250788123456'),
      available: '24/7 Emergency Support',
      color: '#10B981',
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp Support',
      subtitle: 'Chat with agricultural experts',
      value: '+250 788 654 321',
      action: () => handleWhatsApp('+250788654321'),
      available: 'Mon-Fri: 6:00 AM - 8:00 PM',
      color: '#25D366',
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Support',
      subtitle: 'Send detailed inquiries',
      value: 'support@smartel.rw',
      action: () => handleEmail('support@smartel.rw'),
      available: 'Response within 2 hours',
      color: '#3B82F6',
    },
  ];

  const officeLocations = [
    {
      name: 'Kigali Headquarters',
      address: 'KG 15 Ave, Kigali, Rwanda',
      phone: '+250 788 123 456',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    },
    {
      name: 'Nyagatare Field Office',
      address: 'Nyagatare District, Eastern Province',
      phone: '+250 788 234 567',
      hours: 'Mon-Sat: 7:00 AM - 5:00 PM',
    },
  ];

  const handlePhoneCall = async (phoneNumber: string) => {
    try {
      const supported = await Linking.canOpenURL(`tel:${phoneNumber}`);
      if (supported) {
        await Linking.openURL(`tel:${phoneNumber}`);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleWhatsApp = async (phoneNumber: string) => {
    try {
      const message = encodeURIComponent('Hello, I need help with sentra-bot account setup.');
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      const webUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open WhatsApp');
    }
  };

  const handleEmail = async (email: string) => {
    try {
      const subject = encodeURIComponent('sentra-bot Account Setup Request');
      const body = encodeURIComponent('Hello,\n\nI would like to request access to the sentra-bot platform for crop monitoring.\n\nPlease provide information about:\n- Account setup process\n- Required documentation\n- Training schedule\n\nThank you.');
      const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
      
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert('Error', 'Email client not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open email client');
    }
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
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contact Support</Text>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.iconContainer}>
              <Headphones size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>We're Here to Help</Text>
            <Text style={styles.subtitle}>
              Get assistance with account setup, technical support, or agricultural guidance from our expert team.
            </Text>
          </View>

          {/* Contact Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Methods</Text>
            {contactMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.contactCard,
                  selectedContact === method.id && styles.contactCardSelected
                ]}
                onPress={() => {
                  setSelectedContact(method.id);
                  setTimeout(() => {
                    method.action();
                    setSelectedContact(null);
                  }, 200);
                }}
              >
                <View style={styles.contactCardContent}>
                  <View style={[styles.contactIcon, { backgroundColor: `${method.color}15` }]}>
                    <method.icon size={24} color={method.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>{method.title}</Text>
                    <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
                    <Text style={styles.contactValue}>{method.value}</Text>
                    <View style={styles.availabilityContainer}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.availabilityText}>{method.available}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Office Locations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Office Locations</Text>
            {officeLocations.map((office, index) => (
              <View key={index} style={styles.officeCard}>
                <View style={styles.officeHeader}>
                  <MapPin size={20} color="#10B981" />
                  <Text style={styles.officeName}>{office.name}</Text>
                </View>
                <Text style={styles.officeAddress}>{office.address}</Text>
                <View style={styles.officeDetails}>
                  <View style={styles.officeDetailRow}>
                    <Phone size={14} color="#6B7280" />
                    <Text style={styles.officeDetailText}>{office.phone}</Text>
                  </View>
                  <View style={styles.officeDetailRow}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.officeDetailText}>{office.hours}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Questions</Text>
            <View style={styles.faqCard}>
              <Text style={styles.faqQuestion}>How do I get a sentra-bot account?</Text>
              <Text style={styles.faqAnswer}>
                sentra-bot accounts are provided through our agricultural extension program. Contact our support team to register and receive training.
              </Text>
            </View>
            <View style={styles.faqCard}>
              <Text style={styles.faqQuestion}>Is there a cost for the service?</Text>
              <Text style={styles.faqAnswer}>
                sentra-bot is provided free of charge to registered farmers as part of Rwanda's digital agriculture initiative.
              </Text>
            </View>
            <View style={styles.faqCard}>
              <Text style={styles.faqQuestion}>What training is provided?</Text>
              <Text style={styles.faqAnswer}>
                We provide comprehensive training on device setup, app usage, and interpreting crop monitoring data.
              </Text>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencySection}>
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyHeader}>
                <Phone size={24} color="#EF4444" />
                <Text style={styles.emergencyTitle}>Emergency Agricultural Support</Text>
              </View>
              <Text style={styles.emergencyText}>
                For urgent crop threats or pest outbreaks requiring immediate attention
              </Text>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => handlePhoneCall('+250788999888')}
              >
                <Text style={styles.emergencyButtonText}>Call Emergency Line</Text>
                <Text style={styles.emergencyNumber}>+250 788 999 888</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Back to Sign In */}
          <TouchableOpacity
            style={styles.backToSignInButton}
            onPress={() => router.push('/auth/signin')}
          >
            <Text style={styles.backToSignInText}>Back to Sign In</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
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
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactCardSelected: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 6,
  },
  contactValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 6,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  officeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  officeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  officeAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  officeDetails: {
    gap: 6,
  },
  officeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officeDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  faqCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  emergencySection: {
    marginBottom: 30,
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginLeft: 12,
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F1D1D',
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  emergencyNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  backToSignInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backToSignInText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});