import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { FAB, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Task } from '../types';
import { 
  subscribeToUserTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../services/firestore';
import { scheduleTaskNotification } from '../services/notifications';

export const TasksScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask?.id) {
        await updateTask(editingTask.id, taskData);
        setSnackbarMessage(t('taskUpdated'));
      } else {
        const taskId = await createTask(
          taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
          user!.uid
        );
        
        // Schedule notification if task has due date
        if (taskData.dueDate) {
          const dueDate = new Date(taskData.dueDate);
          if (dueDate > new Date()) {
            await scheduleTaskNotification(
              taskData.title!,
              taskData.description || t('taskReminder'),
              dueDate
            );
            setSnackbarMessage(t('notificationScheduled'));
          }
        } else {
          setSnackbarMessage(t('taskCreated'));
        }
      }
      setEditingTask(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert(t('errorOccurred'), (error as Error).message);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id!, { completed: !task.completed });
    } catch (error) {
      Alert.alert(t('errorOccurred'), (error as Error).message);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      t('deleteTask'),
      t('confirmDelete'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id!);
              setSnackbarMessage(t('taskDeleted'));
            } catch (error) {
              Alert.alert(t('errorOccurred'), (error as Error).message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('noTasks')}</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
        }}
      />
      
      <TaskForm
        visible={modalVisible}
        task={editingTask}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
      />
      
      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage('')}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  listContent: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});