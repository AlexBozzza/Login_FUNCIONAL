import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function OwnerDetailScreen() {
  const { id } = useLocalSearchParams();
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadOwner();
    }
  }, [id]);

  const loadOwner = async () => {
    try {
      const response = await API.get(`/owners/${id}`);
      setOwner(response.data.data);
    } catch (error) {
      console.error('Error cargando propietario', error);
    }
  };

  // ✅ ELIMINAR PROPIETARIO (WEB + MÓVIL)
  const handleDelete = async () => {
    // 🌐 WEB
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm(
        '¿Seguro que deseas eliminar este propietario?'
      );

      if (!confirmDelete) return;

      try {
        await API.delete(`/owners/${id}`);
        router.replace('/propietarios');
      } catch (error) {
        console.error('Error eliminando propietario', error);
        alert('No se pudo eliminar el propietario');
      }
      return;
    }

    // 📱 MÓVIL
    Alert.alert(
      'Eliminar propietario',
      '¿Seguro que deseas eliminar este propietario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.delete(`/owners/${id}`);
              router.replace('/propietarios');
            } catch (error) {
              console.error('Error eliminando propietario', error);
              Alert.alert('Error', 'No se pudo eliminar el propietario');
            }
          },
        },
      ]
    );
  };

  if (!owner) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando propietario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffd166" />
        </Pressable>
        <Text style={styles.title}>Detalle del Propietario</Text>
      </View>

      {/* Card principal */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-circle" size={34} color="#ffd166" />
          <Text style={styles.name}>{owner.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>{owner.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>{owner.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>{owner.address}</Text>
        </View>
      </View>

      {/* Botón editar */}
      <Pressable
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: '/propietarios/edit/[id]',
            params: { id: owner.id.toString() },
          })
        }
      >
        <Ionicons name="create" size={18} color="#2b2b2b" />
        <Text style={styles.editText}>  Editar propietario</Text>
      </Pressable>

      {/* Botón eliminar */}
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash" size={18} color="#fff" />
        <Text style={styles.deleteText}>  Eliminar propietario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b2a1a',
    padding: 16,
  },

  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#6b4b2a',
    padding: 18,
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  infoText: {
    color: '#e8cfa3',
  },

  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
  },

  editText: {
    fontWeight: 'bold',
    color: '#2b2b2b',
  },

  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b00020',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
