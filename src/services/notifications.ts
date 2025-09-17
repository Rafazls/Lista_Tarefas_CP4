// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  // Configurar canal para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Para Expo SDK 54+, o método getExpoPushTokenAsync mudou
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
      if (!projectId) {
        console.log('Project ID not found - notifications will work locally but not with push');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId,
      })).data;
      
      console.log('Push token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleTaskNotification(
  title: string, 
  body: string, 
  date: Date
): Promise<string> {
  try {
    // Calcular segundos até a data alvo
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
    
    // Não agendar se a data já passou
    if (seconds < 0) {
      throw new Error('Cannot schedule notification in the past');
    }

    // Criar o trigger com tipo explícito
    const trigger: Notifications.TimeIntervalTriggerInput = {
      seconds: seconds > 0 ? seconds : 1, // Mínimo de 1 segundo
      repeats: false,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'task' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        badge: 1,
      },
      trigger,
    });

    console.log('Notification scheduled with id:', id);
    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

// Alternativa: Agendar com data específica usando DateTrigger
export async function scheduleTaskNotificationAtDate(
  title: string,
  body: string,
  date: Date
): Promise<string> {
  try {
    // Validar que a data é futura
    if (date.getTime() <= Date.now()) {
      throw new Error('Date must be in the future');
    }

    // Criar DateTrigger com tipo explícito
    const trigger: Notifications.DateTriggerInput = {
      date: date,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'task' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    return id;
  } catch (error) {
    console.error('Error scheduling notification at date:', error);
    // Fallback para TimeInterval se DateTrigger falhar
    try {
      const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
      if (seconds > 0) {
        return await scheduleTaskNotification(title, body, date);
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    throw error;
  }
}

// Função usando CalendarTrigger (mais precisa para datas específicas)
export async function scheduleTaskNotificationCalendar(
  title: string,
  body: string,
  date: Date
): Promise<string> {
  try {
    // Validar que a data é futura
    if (date.getTime() <= Date.now()) {
      throw new Error('Date must be in the future');
    }

    const trigger: Notifications.CalendarTriggerInput = {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // JavaScript months are 0-indexed
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: 0,
      repeats: false,
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'task' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    return id;
  } catch (error) {
    console.error('Error scheduling calendar notification:', error);
    throw error;
  }
}

// Versão simplificada que funciona sempre
export async function scheduleSimpleNotification(
  title: string,
  body: string,
  secondsFromNow: number = 60
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'task' },
      },
      trigger: {
        seconds: secondsFromNow,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      } as Notifications.TimeIntervalTriggerInput,
    });
    
    return id;
  } catch (error) {
    console.error('Error in simple notification:', error);
    throw error;
  }
}

export async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

// Função para cancelar todas as notificações agendadas
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

// Função para listar todas as notificações agendadas (útil para debug)
export async function getAllScheduledNotifications() {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', scheduled);
    return scheduled;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

// Listener para quando o usuário clica em uma notificação
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Listener para quando uma notificação é recebida (app em foreground)
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Função de teste para verificar se as notificações estão funcionando
export async function testNotification() {
  try {
    const permission = await registerForPushNotificationsAsync();
    
    await scheduleSimpleNotification(
      '🔔 Teste de Notificação',
      'Se você está vendo isso, as notificações estão funcionando!',
      5 // 5 segundos
    );
    
    console.log('Test notification scheduled for 5 seconds from now');
    return true;
  } catch (error) {
    console.error('Test notification failed:', error);
    return false;
  }
}