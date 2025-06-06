import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { HabitTheme } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAddHabit: (name: string, theme: HabitTheme) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onAddHabit,
}) => {
  const [habitName, setHabitName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<HabitTheme>('blue');
  const { colors, isDarkMode } = useTheme();
  
  // Create dynamic styles based on theme
  const dynamicStyles = {
    selectedThemeBorder: {
      borderColor: isDarkMode ? '#fff' : '#000',
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#555' : '#ccc',
    },
    addButton: {
      backgroundColor: '#2196F3',
    },
    disabledButton: {
      backgroundColor: isDarkMode ? '#555555' : '#B0BEC5',
    },
  };

  const handleAddHabit = () => {
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), selectedTheme);
      setHabitName('');
      setSelectedTheme('blue');
      onClose();
    }
  };

  const handleClose = () => {
    setHabitName('');
    setSelectedTheme('blue');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Habit</Text>
              
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: isDarkMode ? '#555' : '#ccc'
                }]}
                placeholder="Habit name"
                placeholderTextColor={isDarkMode ? '#888' : '#999'}
                value={habitName}
                onChangeText={setHabitName}
                maxLength={30}
                autoFocus
              />
              
              <Text style={[styles.themeLabel, { color: colors.text }]}>Choose a theme color:</Text>
              
              <View style={styles.themeContainer}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    styles.redTheme,
                    selectedTheme === 'red' && [styles.selectedTheme, dynamicStyles.selectedThemeBorder],
                  ]}
                  onPress={() => setSelectedTheme('red')}
                />
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    styles.blueTheme,
                    selectedTheme === 'blue' && [styles.selectedTheme, dynamicStyles.selectedThemeBorder],
                  ]}
                  onPress={() => setSelectedTheme('blue')}
                />
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    styles.greenTheme,
                    selectedTheme === 'green' && [styles.selectedTheme, dynamicStyles.selectedThemeBorder],
                  ]}
                  onPress={() => setSelectedTheme('green')}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, dynamicStyles.cancelButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.button, 
                    dynamicStyles.addButton,
                    !habitName.trim() && dynamicStyles.disabledButton,
                  ]}
                  onPress={handleAddHabit}
                  disabled={!habitName.trim()}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  themeLabel: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    fontSize: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  themeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  redTheme: {
    backgroundColor: '#FF5252',
  },
  blueTheme: {
    backgroundColor: '#2196F3',
  },
  greenTheme: {
    backgroundColor: '#4CAF50',
  },
  selectedTheme: {
    borderWidth: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddHabitModal;
