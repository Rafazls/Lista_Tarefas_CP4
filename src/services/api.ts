import { Advice } from '../types';

export const fetchAdvice = async (): Promise<Advice> => {
  const response = await fetch('https://api.adviceslip.com/advice');
  if (!response.ok) {
    throw new Error('Failed to fetch advice');
  }
  return response.json();
};
