import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchAdvice } from '../services/api';

export const AdviceScreen: React.FC = () => {
  const { t } = useTranslation();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['advice'],
    queryFn: fetchAdvice,
    staleTime: 0,
  });

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t('advice')}</Title>
          
          {isLoading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : error ? (
            <Paragraph style={styles.error}>{t('errorOccurred')}</Paragraph>
          ) : data ? (
            <Paragraph style={styles.advice}>{data.slip.advice}</Paragraph>
          ) : null}
        </Card.Content>
        
        <Card.Actions>
          <Button 
            mode="contained" 
            onPress={() => refetch()}
            disabled={isLoading}
          >
            {t('getAdvice')}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  advice: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
    lineHeight: 26,
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
  loader: {
    marginVertical: 20,
  },
});