import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { 
  Modal, 
  Portal, 
  TextInput, 
  Button, 
  Title,
  Switch,
  Text
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskFormProps {
  visible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  visible, 
  task, 
  onClose, 
  onSave 
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [hasDueDate, setHasDueDate] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      if (task.dueDate) {
        setDueDate(new Date(task.dueDate));
        setHasDueDate(true);
      } else {
        setHasDueDate(false);
      }
    } else {
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setHasDueDate(false);
    }
  }, [task]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        dueDate: hasDueDate ? dueDate.toISOString() : '',
        completed: task?.completed || false,
      });
      onClose();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(dueDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDueDate(newDate);
    }
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <Title style={styles.title}>
            {task ? t('editTask') : t('addTask')}
          </Title>
          
          <TextInput
            label={t('taskTitle')}
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label={t('taskDescription')}
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          
          <View style={styles.switchContainer}>
            <Text>{t('dueDate')}</Text>
            <Switch
              value={hasDueDate}
              onValueChange={(value) => {
                setHasDueDate(value);
                if (value) setShowDatePicker(true);
              }}
            />
          </View>
          
          {hasDueDate && (
            <View style={styles.dateContainer}>
              <Text>{format(dueDate, 'dd/MM/yyyy HH:mm')}</Text>
              <Button onPress={() => setShowDatePicker(true)}>
                {t('change')}
              </Button>
            </View>
          )}
          
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          
          {showTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          
          <View style={styles.buttons}>
            <Button mode="text" onPress={onClose}>
              {t('cancel')}
            </Button>
            <Button mode="contained" onPress={handleSave}>
              {t('save')}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});