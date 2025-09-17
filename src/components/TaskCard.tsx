import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Checkbox, IconButton, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { Task } from '../types';
import { useTranslation } from 'react-i18next';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const { t } = useTranslation();
  
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Checkbox
            status={task.completed ? 'checked' : 'unchecked'}
            onPress={() => onToggleComplete(task)}
          />
          <View style={styles.titleContainer}>
            <Title style={[styles.title, task.completed && styles.completedText]}>
              {task.title}
            </Title>
            {task.dueDate && (
              <Chip icon="clock" compact style={styles.dueDateChip}>
                {format(new Date(task.dueDate), 'dd/MM/yyyy HH:mm')}
              </Chip>
            )}
          </View>
          <View style={styles.actions}>
            <IconButton icon="pencil" onPress={() => onEdit(task)} />
            <IconButton icon="delete" onPress={() => onDelete(task)} />
          </View>
        </View>
        {task.description && (
          <Paragraph style={[styles.description, task.completed && styles.completedText]}>
            {task.description}
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    marginLeft: 46,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  dueDateChip: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});