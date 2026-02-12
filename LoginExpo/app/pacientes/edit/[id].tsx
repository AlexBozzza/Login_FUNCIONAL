import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import API from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function EditPatientScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const response = await API.get(`/patients/${id}`);
      const p = response.data.data;

      setName(p.name || '');
      setSpecies(p.species || '');
      setBreed(p.breed || '');
      setAge(p.age ? String(p.age) : '');
      setMedicalHistory(p.medical_history || '');
    } catch (error) {
      console.error('Error cargando paciente', error);
    }
  };

  const handleSave = async () => {
    if (!name || !species) {
      alert('Nombre y especie son obligatorios');
      return;
    }

    try {
      setLoading(true);

      await API.put(`/patients/${id}`, {
        name,
        species,
        breed,
        age: age ? Number(age) : null,
        medical_history: medicalHistory,
      });

      // 🔁 volver al detalle del paciente
      router.replace(`/pacientes/${id}`);
    } catch (error) {
      console.error('Error actualizando paciente', error);
      alert('Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffd166" />
        </Pressable>
        <Text style={styles.title}>Editar paciente</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Especie</Text>
        <TextInput
          style={styles.input}
          value={species}
          onChangeText={setSpecies}
        />

        <Text style={styles.label}>Raza</Text>
        <TextInput
          style={styles.input}
          value={breed}
          onChangeText={setBreed}
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Historial médico</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={medicalHistory}
          onChangeText={setMedicalHistory}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Guardar */}
      <Pressable
        style={styles.button}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Text>
      </Pressable>
    </ScrollView>
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#6b4b2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  label: {
    color: '#ffd166',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#5a3f26',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
    marginBottom: 30,
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
});
