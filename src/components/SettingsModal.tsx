import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { eraseAllData } = useHabits();
  const [isErasing, setIsErasing] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isDarkMode ? '#2196F3' : '#f4f3f4'}
                />
              </View>
              
              <TouchableOpacity
                style={[styles.dangerButton, { opacity: isErasing ? 0.5 : 1 }]}
                onPress={() => {
                  Alert.alert(
                    'Erase All Data',
                    'Are you sure you want to erase all habit data? This action cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Erase', 
                        style: 'destructive',
                        onPress: async () => {
                          setIsErasing(true);
                          await eraseAllData();
                          setIsErasing(false);
                          Alert.alert('Success', 'All habit data has been erased.');
                        } 
                      },
                    ]
                  );
                }}
                disabled={isErasing}
              >
                <Text style={styles.dangerButtonText}>{isErasing ? 'Erasing...' : 'Erase All Data'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: '#2196F3' }]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dangerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: '#FF3B30',
    width: '100%',
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsModal;
