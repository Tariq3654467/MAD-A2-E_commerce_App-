import React, { useState } from 'react';
import { View, StyleSheet, Modal, Dimensions, Platform } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatbotScreen from '../screens/ChatbotScreen';
import { colors } from '../theme/colors';

const { height } = Dimensions.get('window');

const FloatingChatbot = () => {
  const [isVisible, setIsVisible] = useState(false);

  const openChatbot = () => {
    setIsVisible(true);
  };

  const closeChatbot = () => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <FAB
        style={styles.fab}
        icon="robot"
        label="Assistant"
        onPress={openChatbot}
        color={colors.surface}
        backgroundColor={colors.primary}
      />

      {/* Chatbot Modal */}
      <Portal>
        <Modal
          visible={isVisible}
          animationType="slide"
          presentationStyle={Platform.OS === 'web' ? 'fullScreen' : 'pageSheet'}
          onRequestClose={closeChatbot}
        >
          <View style={styles.modalContainer}>
            <ChatbotScreen onClose={closeChatbot} />
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: Platform.OS === 'web' ? 20 : 100, // Above the tab bar
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default FloatingChatbot;
