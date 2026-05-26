// App.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [serverStatus, setServerStatus] = useState<string>('Conectando...');

  const fetchStatus = async () => {
    try {
      // Lembre-se de trocar "localhost" pelo IP da sua máquina se estiver usando um dispositivo físico
      const response = await fetch('http://192.168.3.138:3000/api/status'); 
      const data = await response.json();
      setServerStatus(`Servidor: ${data.status}`);
    } catch (error) {
      setServerStatus('Erro de conexão');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A5568" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Meu App Fullstack</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardText}>Status: {serverStatus}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={fetchStatus}>
          <Text style={styles.buttonText}>Atualizar Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A5568', // Cor de fundo
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#374151', // Um tom um pouco mais escuro para dar profundidade
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#F7FF00', // Destaque lateral
  },
  cardText: {
    color: '#E2E8F0',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#F7FF00', // Botão de destaque
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#F7FF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#4A5568', // Texto escuro no botão amarelo para contraste máximo
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});