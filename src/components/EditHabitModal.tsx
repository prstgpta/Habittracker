import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Habit, HabitTheme } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';

interface EditHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdateHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  habit: Habit | null;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({
  visible,
  onClose,
  onUpdateHabit,
  onDeleteHabit,
  habit,
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
    updateButton: {
      backgroundColor: '#2196F3',
    },
    deleteButton: {
      backgroundColor: '#FF5252',
    },
    disabledButton: {
      backgroundColor: isDarkMode ? '#555555' : '#B0BEC5',
    },
  };

  // Update state when the habit prop changes
  useEffect(() => {
    if (habit) {
      setHabitName(habit.name);
      setSelectedTheme(habit.theme);
    }
  }, [habit]);

  const handleUpdateHabit = () => {
    if (habit && habitName.trim()) {
      onUpdateHabit({
        ...habit,
        name: habitName.trim(),
        theme: selectedTheme,
      });
      handleClose();
    }
  };

  const handleDeleteHabit = () => {
    if (habit) {
      Alert.alert(
        'Delete Habit',
        `Are you sure you want to delete "${habit.name}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              onDeleteHabit(habit.id);
              handleClose();
            },
            style: 'destructive',
          },
        ]
      );
    }
  };

  const handleClose = () => {
    setHabitName('');
    setSelectedTheme('blue');
    onClose();
  };

  if (!habit) return null;

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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Habit</Text>
              
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
                  style={[styles.button, dynamicStyles.deleteButton]}
                  onPress={handleDeleteHabit}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                
                <View style={styles.rightButtons}>
                  <TouchableOpacity
                    style={[styles.button, dynamicStyles.cancelButton]}
                    onPress={handleClose}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.button, 
                      dynamicStyles.updateButton,
                      !habitName.trim() && dynamicStyles.disabledButton,
                    ]}
                    onPress={handleUpdateHabit}
                    disabled={!habitName.trim()}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
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
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditHabitModal;
