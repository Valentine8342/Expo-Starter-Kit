import React, { useCallback, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../contexts/ThemeContext';
import { SectionTitle } from '../../components/atoms/SectionTitle';
import { NotificationsSection } from '../../components/organisms/NotificationsSection';
import { BottomMenuSection } from '../../components/organisms/BottomMenuSection';
import { ThemeSettingsSection } from '../../components/organisms/ThemeSettingsSection';
import { DebugStorageSection } from '../../components/primitives/debug/DebugStorageSection';
import { ExternalLink } from 'lucide-react-native';

type SettingsScreenRouteProp = RouteProp<{
  params: { 
    bottomMenuEnabled?: boolean; 
    onBottomMenuToggle?: (value: boolean) => void;
  }
}, 'params'>;

export function SettingsScreen() {
  const route = useRoute<SettingsScreenRouteProp>();
  const [bottomMenuEnabled, setBottomMenuEnabled] = useState(false);
  const router = useRouter();
  
  const { 
    pushEnabled, 
    reminderEnabled, 
    handlePushToggle, 
    setReminderEnabled,
    configureNotifications
  } = useNotifications();

  const { isDarkMode } = useTheme();

  const onBottomMenuToggle = route.params?.onBottomMenuToggle || (() => {});

  const handleBottomMenuToggle = useCallback((value: boolean) => {
    setBottomMenuEnabled(value);
    onBottomMenuToggle(value);
  }, [onBottomMenuToggle]);

  const navigateToExample = () => {
    router.push('/(non-tabs)/example');
  };

  const getSectionClassName = (isDark: boolean) => `
    rounded-xl shadow-sm border overflow-visible 
    ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
    mt-4 max-w-md w-full mx-auto
  `;

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 min-h-screen justify-center p-4 space-y-6">
        {!bottomMenuEnabled && (
          <>
            <View className={`${getSectionClassName(isDarkMode)} mt-8`}>
              <View className="px-4 py-3">
                <SectionTitle>
                  Navigation Demo
                </SectionTitle>
              </View>
              <View className="px-4 py-2">
                <Text className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Test smooth navigation transitions in non-tab routes
                </Text>
                <TouchableOpacity
                  onPress={navigateToExample}
                  className={`
                    flex-row items-center py-3 px-4 rounded-xl
                    ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'}
                  `}
                >
                  <ExternalLink size={18} color="white" />
                  <Text className="text-white font-medium ml-2">
                    Open Example Screen
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className={getSectionClassName(isDarkMode)}>
              <View className="px-4 py-3">
                <SectionTitle>
                  Notifications
                </SectionTitle>
              </View>
              <NotificationsSection
                pushEnabled={pushEnabled}
                onPushChange={handlePushToggle}
                reminderEnabled={reminderEnabled}
                onReminderChange={setReminderEnabled}
                configureNotifications={configureNotifications}
              />
            </View>

            <View className={getSectionClassName(isDarkMode)}>
              <View className="px-4 py-3">
                <SectionTitle>
                  Theme Settings
                </SectionTitle>
              </View>
              <ThemeSettingsSection />
            </View>
          </>
        )}

        <View className={`${getSectionClassName(isDarkMode)} mb-10`}>
          <View className="px-4 py-3">
            <SectionTitle>
              Debug Menu
            </SectionTitle>
          </View>
          <BottomMenuSection
            bottomMenuEnabled={bottomMenuEnabled}
            onBottomMenuChange={handleBottomMenuToggle}
          />
        </View>

        {bottomMenuEnabled && (
          <View className={getSectionClassName(isDarkMode)}>
            <View className="px-4 py-3">
              <SectionTitle>
                Debug: AsyncStorage
              </SectionTitle>
            </View>
            <DebugStorageSection />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default SettingsScreen;