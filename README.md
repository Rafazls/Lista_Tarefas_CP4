# 📱 Lista de Tarefas Plus

Um aplicativo completo de gerenciamento de tarefas desenvolvido com Expo e React Native, incluindo sincronização em tempo real, notificações locais e integração com API externa.


## 🚀 Como Executar


### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative a autenticação (Email/Password e Google)
3. Crie um banco de dados Firestore
4. Configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{task} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

5. Copie as credenciais do Firebase para `src/config/firebase.js`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lista_tarefas_plus.git

# Entre na pasta do projeto
cd lista_tarefas_plus

# Instale as dependências
npm install

# Para iOS (se estiver no macOS)
cd ios && pod install && cd ..
```

### Executando o Projeto

```bash
# Iniciar o Metro Bundler
npm start
```

## 📱 Gerando APK

### Usando EAS Build

1. Instale o EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure o EAS:
```bash
eas login
eas build:configure
```

3. Gere o APK:
```bash
eas build -p android --profile preview

```

## 📋 Modelo de Dados

### Tarefa (Task)
```typescript
{
  id: string;           // ID único (Firestore)
  title: string;        // Título da tarefa
  description: string;  // Descrição detalhada
  completed: boolean;   // Status de conclusão
  dueDate: string;      // Data de vencimento (ISO)
  createdAt: Timestamp; // Data de criação
  updatedAt: Timestamp; // Última atualização
  userId: string;       // ID do usuário proprietário
}
```

## 👨‍💻 Aluno

Rafael Bezerra - RM557888
