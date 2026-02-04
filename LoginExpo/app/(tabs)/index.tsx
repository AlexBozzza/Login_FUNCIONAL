import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await API.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>

      {/* Botón cerrar sesión arriba */}
      <Pressable style={styles.logoutTop} onPress={handleLogout}>
        <Text style={styles.logoutTopText}>Cerrar sesión</Text>
      </Pressable>

      <Text style={styles.title}>Panel Veterinario</Text>

      {user && (
        <Text style={styles.subtitle}>
          Bienvenido, {user.nombre} 👋
        </Text>
      )}

      <View style={styles.cards}>
        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>Propietarios</Text>
          <Text style={styles.cardText}>Administrar dueños</Text>
        </Pressable>

        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>Pacientes</Text>
          <Text style={styles.cardText}>Gestionar mascotas</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b2a1a',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#f5d7a1',
    marginBottom: 30,
  },
  cards: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#6b4b2a',
    padding: 20,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    color: '#e8cfa3',
    marginTop: 6,
  },

  /* Botón logout arriba */
  logoutTop: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#8b5e34',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    zIndex: 10,
  },
  logoutTopText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
