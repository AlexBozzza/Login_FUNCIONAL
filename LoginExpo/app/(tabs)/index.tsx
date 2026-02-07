import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
        headers: { Authorization: `Bearer ${token}` },
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

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Panel Veterinario</Text>
          {user && (
            <Text style={styles.subtitle}>
              Bienvenido, {user.nombre} 👋
            </Text>
          )}
        </View>

        <Pressable style={styles.logoutTop} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
        </Pressable>
      </View>

      {/* BRANDING */}
      <View style={styles.branding}>
        <Ionicons name="paw" size={48} color="#ffd166" />
        <Text style={styles.brandTitle}>Clínica Veterinaria Rústica</Text>
        <Text style={styles.brandSubtitle}>
          “Cuidando tus animales como familia”
        </Text>
      </View>

      {/* CARDS PRINCIPALES */}
      <View style={styles.cards}>

        {/* PROPIETARIOS */}
        <Pressable
          style={styles.card}
          onPress={() => router.push('/propietarios')}
        >
          <Ionicons name="people" size={28} color="#ffd166" />
          <View>
            <Text style={styles.cardTitle}>Propietarios</Text>
            <Text style={styles.cardText}>Administrar dueños</Text>
          </View>
        </Pressable>

        {/* PACIENTES */}
        <Pressable
          style={styles.card}
          onPress={() => router.push('/pacientes/index')}
        >
          <MaterialIcons name="pets" size={28} color="#ffd166" />
          <View>
            <Text style={styles.cardTitle}>Pacientes</Text>
            <Text style={styles.cardText}>Gestionar mascotas</Text>
          </View>
        </Pressable>

      </View>

      {/* GESTIÓN DE USUARIOS */}
      <View style={styles.userManagement}>
        <Text style={styles.sectionTitle}>Gestión de Usuarios</Text>

        {/* CREAR USUARIO */}
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/usuarios/create/index')}
        >
          <Ionicons name="person-add" size={20} color="#2b2b2b" />
          <Text style={styles.actionText}>  Crear usuario</Text>
        </Pressable>

        {/* EDITAR USUARIO */}
        <Pressable
          style={styles.actionButtonSecondary}
          onPress={() => router.push('/usuarios/index')}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={[styles.actionText, { color: '#fff' }]}>
            {' '}Editar usuario
          </Text>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#f5d7a1',
    marginTop: 4,
  },

  logoutTop: {
    backgroundColor: '#8b5e34',
    padding: 10,
    borderRadius: 20,
  },

  branding: {
    alignItems: 'center',
    marginVertical: 30,
  },

  brandTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  brandSubtitle: {
    color: '#e8cfa3',
    marginTop: 6,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  cards: {
    gap: 12,
  },

  card: {
    backgroundColor: '#6b4b2a',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardText: {
    color: '#e8cfa3',
    marginTop: 4,
  },

  userManagement: {
    marginTop: 30,
    backgroundColor: '#5a3f26',
    padding: 18,
    borderRadius: 14,
  },

  sectionTitle: {
    color: '#ffd166',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  actionButton: {
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonSecondary: {
    backgroundColor: '#8b5e34',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionText: {
    color: '#2b2b2b',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
