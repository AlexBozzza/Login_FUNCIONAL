import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import API from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function PatientsScreen() {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await API.get('/patients');
      setPatients(response.data.data);
    } catch (error) {
      console.error('Error cargando pacientes', error);
    }
  };

  const renderItem = ({ item }: any) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/pacientes/[id]',
          params: { id: item.id.toString() },
        })
      }
    >
      {/* Nombre */}
      <View style={styles.row}>
        <Ionicons name="paw" size={26} color="#ffd166" />
        <Text style={styles.name}>{item.name}</Text>
      </View>

      {/* Especie */}
      <View style={styles.infoRow}>
        <Ionicons name="leaf" size={16} color="#e8cfa3" />
        <Text style={styles.infoText}>{item.species}</Text>
      </View>

      {/* Dueño */}
      <View style={styles.infoRow}>
        <Ionicons name="person" size={16} color="#e8cfa3" />
        <Text style={styles.infoText}>{item.owner_name}</Text>
      </View>

      <Text style={styles.viewMore}>Ver detalle →</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>

        {/* BOTÓN + (por ahora sin funcionalidad real) */}
        <Pressable
         style={styles.addButton}
         onPress={() => router.push('/pacientes/create')}
>
        <Ionicons name="add" size={22} color="#2b2b2b" />
        </Pressable>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b2a1a',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#f4a000',
    padding: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#6b4b2a',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    color: '#e8cfa3',
  },
  viewMore: {
    color: '#ffd166',
    marginTop: 8,
    fontWeight: 'bold',
  },
});
