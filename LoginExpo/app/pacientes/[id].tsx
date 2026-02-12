import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const response = await API.get(`/patients/${id}`);
      setPatient(response.data.data);
    } catch (error) {
      console.error('Error cargando paciente', error);
    }
  };

const handleDelete = async () => {
  // 🌐 WEB
  if (Platform.OS === 'web') {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar este paciente?'
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/patients/${id}`);
      router.replace('/pacientes');
    } catch (error) {
      console.error('Error eliminando paciente', error);
      alert('No se pudo eliminar el paciente');
    }
    return;
  }

  // 📱 MÓVIL (Android / iOS)
  Alert.alert(
    'Eliminar paciente',
    '¿Seguro que deseas eliminar este paciente?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await API.delete(`/patients/${id}`);
            router.replace('/pacientes');
          } catch (error) {
            console.error('Error eliminando paciente', error);
            Alert.alert('Error', 'No se pudo eliminar el paciente');
          }
        },
      },
    ]
  );
};



  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando paciente...</Text>
      </View>
    );
  }

  // ✅ Fecha corregida (MySQL → ISO)
  const createdAtFormatted = patient.created_at
    ? new Date(patient.created_at.replace(' ', 'T')).toLocaleDateString()
    : 'Fecha no disponible';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffd166" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalle del Paciente</Text>
      </View>

      {/* Card principal */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="paw" size={28} color="#ffd166" />
          <Text style={styles.name}>{patient.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="leaf" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>Especie: {patient.species}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="git-branch" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>Raza: {patient.breed}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>Edad: {patient.age} años</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person" size={18} color="#e8cfa3" />
          <Text style={styles.infoText}>Dueño: {patient.owner_name}</Text>
        </View>
      </View>

      {/* Historial médico */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>🩺 Historial médico</Text>
        <Text style={styles.historyText}>
          {patient.medical_history
            ? patient.medical_history
            : 'No hay historial médico registrado.'}
        </Text>
      </View>

      {/* Fecha de registro */}
      <View style={styles.dateCard}>
        <Ionicons name="time-outline" size={16} color="#ffd166" />
        <Text style={styles.dateText}>
          Registrado el {createdAtFormatted}
        </Text>
      </View>

      {/* Botón editar */}
      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: '/pacientes/edit/[id]',
            params: { id: patient.id.toString() },
          })
        }
      >
        <Text style={styles.buttonText}>Editar paciente</Text>
      </Pressable>

      {/* Botón eliminar */}
         <Pressable style={styles.deleteButton} onPress={handleDelete}>
         <Ionicons name="trash" size={18} color="#fff" />
        <Text style={styles.deleteText}>  Eliminar paciente</Text>
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
    marginBottom: 16,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#6b4b2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },

  infoText: {
    color: '#e8cfa3',
  },

  historyCard: {
    backgroundColor: '#5a3f26',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#ffd166',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  historyText: {
    color: '#fff',
    lineHeight: 20,
  },

  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },

  dateText: {
    color: '#e8cfa3',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
  },

  buttonText: {
    textAlign: 'center',
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
