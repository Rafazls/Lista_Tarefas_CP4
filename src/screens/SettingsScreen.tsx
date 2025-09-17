import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  List, 
  Switch, 
  Divider, 
  Button,
  RadioButton,
  Title 
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();
  const [language, setLanguage] = React.useState(i18n.language);

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    await i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem('language', newLanguage);
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.sectionTitle}>{t('settings')}</Title>
      
      <List.Section>
        <List.Subheader>{t('appearance')}</List.Subheader>
        <List.Item
          title={t('darkMode')}
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
        />
      </List.Section>
      
      <Divider />
      
      <List.Section>
        <List.Subheader>{t('language')}</List.Subheader>
        <RadioButton.Group onValueChange={handleLanguageChange} value={language}>
          <List.Item
            title="English"
            left={props => <List.Icon {...props} icon="translate" />}
            right={() => <RadioButton value="en" />}
            onPress={() => handleLanguageChange('en')}
          />
          <List.Item
            title="Português"
            left={props => <List.Icon {...props} icon="translate" />}
            right={() => <RadioButton value="pt" />}
            onPress={() => handleLanguageChange('pt')}
          />
        </RadioButton.Group>
      </List.Section>
      
      <Divider />
      
      <List.Section>
        <List.Subheader>{t('account')}</List.Subheader>
        <List.Item
          title={user?.email || ''}
          description={user?.displayName || t('user')}
          left={props => <List.Icon {...props} icon="account" />}
        />
      </List.Section>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={signOut}
          style={styles.signOutButton}
        >
          {t('signOut')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  signOutButton: {
    marginTop: 16,
  },
});