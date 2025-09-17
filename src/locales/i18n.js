// src/locales/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      // Auth
      welcome: 'Welcome',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      signInWithGoogle: 'Sign in with Google',
      signInWithEmail: 'Sign in with Email',
      email: 'Email',
      password: 'Password',
      signUp: 'Sign Up',
      alreadyHaveAccount: 'Already have an account? Sign In',
      createAccount: 'Don\'t have an account? Sign Up',
      
      // Tasks
      tasks: 'Tasks',
      myTasks: 'My Tasks',
      addTask: 'Add Task',
      editTask: 'Edit Task',
      deleteTask: 'Delete Task',
      taskTitle: 'Task Title',
      taskDescription: 'Task Description',
      dueDate: 'Due Date',
      completed: 'Completed',
      pending: 'Pending',
      noTasks: 'No tasks yet. Create your first one!',
      change: 'Change',
      taskReminder: 'Task Reminder',
      
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      
      // Settings
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      notifications: 'Notifications',
      enableNotifications: 'Enable Notifications',
      appearance: 'Appearance',
      account: 'Account',
      user: 'User',
      
      // Advice
      advice: 'Daily Advice',
      getAdvice: 'Get New Advice',
      loading: 'Loading...',
      
      // Messages
      taskCreated: 'Task created successfully',
      taskUpdated: 'Task updated successfully',
      taskDeleted: 'Task deleted successfully',
      errorOccurred: 'An error occurred',
      error: 'Error',
      confirmDelete: 'Are you sure you want to delete this task?',
      notificationScheduled: 'Notification scheduled for this task',
      fillAllFields: 'Please fill all fields'
    }
  },
  pt: {
    translation: {
      // Auth
      welcome: 'Bem-vindo',
      signIn: 'Entrar',
      signOut: 'Sair',
      signInWithGoogle: 'Entrar com Google',
      signInWithEmail: 'Entrar com Email',
      email: 'E-mail',
      password: 'Senha',
      signUp: 'Cadastrar',
      alreadyHaveAccount: 'Já tem uma conta? Entre',
      createAccount: 'Não tem uma conta? Cadastre-se',
      
      // Tasks
      tasks: 'Tarefas',
      myTasks: 'Minhas Tarefas',
      addTask: 'Adicionar Tarefa',
      editTask: 'Editar Tarefa',
      deleteTask: 'Excluir Tarefa',
      taskTitle: 'Título da Tarefa',
      taskDescription: 'Descrição da Tarefa',
      dueDate: 'Data de Vencimento',
      completed: 'Concluída',
      pending: 'Pendente',
      noTasks: 'Sem tarefas ainda. Crie a primeira!',
      change: 'Alterar',
      taskReminder: 'Lembrete de Tarefa',
      
      // Actions
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      confirm: 'Confirmar',
      close: 'Fechar',
      
      // Settings
      settings: 'Configurações',
      language: 'Idioma',
      theme: 'Tema',
      darkMode: 'Modo Escuro',
      lightMode: 'Modo Claro',
      notifications: 'Notificações',
      enableNotifications: 'Ativar Notificações',
      appearance: 'Aparência',
      account: 'Conta',
      user: 'Usuário',
      
      // Advice
      advice: 'Conselho do Dia',
      getAdvice: 'Novo Conselho',
      loading: 'Carregando...',
      
      // Messages
      taskCreated: 'Tarefa criada com sucesso',
      taskUpdated: 'Tarefa atualizada com sucesso',
      taskDeleted: 'Tarefa excluída com sucesso',
      errorOccurred: 'Ocorreu um erro',
      error: 'Erro',
      confirmDelete: 'Tem certeza que deseja excluir esta tarefa?',
      notificationScheduled: 'Notificação agendada para esta tarefa',
      fillAllFields: 'Por favor, preencha todos os campos'
    }
  }
};

// Função de inicialização
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');
  
  if (!savedLanguage) {
    // Usar expo-localization para detectar o idioma do dispositivo
    const deviceLanguage = Localization.locale.split('-')[0]; // pt-BR -> pt
    savedLanguage = deviceLanguage === 'pt' ? 'pt' : 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
};

// Inicializar imediatamente
initI18n();

export default i18n;