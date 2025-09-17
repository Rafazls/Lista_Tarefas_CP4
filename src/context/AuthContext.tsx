// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { User } from '../types';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

// Necessário para o expo-auth-session
WebBrowser.maybeCompleteAuthSession();

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '877104674527-uvq9jhe3lcno0tnjcaauf3noqbh4kur2.apps.googleusercontent.com',
    androidClientId: '877104674527-uvq9jhe3lcno0tnjcaauf3noqbh4kur2.apps.googleusercontent.com'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log('Google Sign-In successful!');
        })
        .catch((error) => {
          console.error('Error during Google Sign-In:', error);
          Alert.alert('Erro', 'Falha ao fazer login com Google');
        });
    }
  }, [response]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Senha incorreta');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else {
        throw new Error('Erro ao fazer login');
      }
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está em uso');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else {
        throw new Error('Erro ao criar conta');
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!request) {
        Alert.alert('Erro', 'Google Sign-In não está configurado corretamente');
        return;
      }
      
      const result = await promptAsync();
      
      if (result.type === 'cancel') {
        console.log('User cancelled Google Sign-In');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      Alert.alert('Erro', 'Falha ao iniciar login com Google');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};