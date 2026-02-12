import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import API from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePatientScreen() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [owners, setOwners] = useState<any[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [selectedOwnerName, setSelectedOwnerName] = useState('');
  const [showOwners, setShowOwners] = useState(false);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const response = await API.get('/owners');
      setOwners(response.data.data);
    } catch (error) {
      console.error('Error cargando propietarios', error);
    }
  };

  const handleSave = async () => {
    if (!selectedOwner) {
      alert('Selecciona un propietario');
      return;
    }

    try {
      await API.post('/patients', {
        name,
        species,
        breed,
        age: age ? Number(age) : null,
        medical_history: medicalHistory,
        owner_id: selectedOwner,
      });

      router.replace('/pacientes');
    } catch (error) {
      console.error('Error creando paciente', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffd166" />
        </Pressable>
        <Text style={styles.title}>Nuevo Paciente</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <TextInput
          placeholder="Nombre del paciente"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Especie (Perro, Gato, etc)"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={species}
          onChangeText={setSpecies}
        />

        <TextInput
          placeholder="Raza"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={breed}
          onChangeText={setBreed}
        />

        <TextInput
          placeholder="Edad"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          placeholder="Historial médico"
          placeholderTextColor="#d8cfc4"
          style={[styles.input, styles.textArea]}
          multiline
          value={medicalHistory}
          onChangeText={setMedicalHistory}
        />

        {/* Selector propietario */}
        <Text style={styles.label}>Propietario</Text>

        <Pressable
          style={styles.selector}
          onPress={() => setShowOwners(!showOwners)}
        >
          <Ionicons name="person" size={18} color="#ffd166" />
          <Text style={styles.selectorText}>
            {selectedOwnerName || 'Seleccionar propietario'}
          </Text>
          <Ionicons
            name={showOwners ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#ffd166"
          />
        </Pressable>

        {showOwners && (
          <View style={styles.dropdown}>
            {owners.map((owner) => (
              <Pressable
                key={owner.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedOwner(owner.id);
                  setSelectedOwnerName(owner.name);
                  setShowOwners(false);
                }}
              >
                <Ionicons name="person" size={16} color="#ffd166" />
                <Text style={styles.ownerText}>{owner.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Botón guardar */}
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar paciente</Text>
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
    marginBottom: 16,
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
  },

  input: {
    backgroundColor: '#5a3f26',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  label: {
    color: '#ffd166',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },

  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5a3f26',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  selectorText: {
    color: '#fff',
    flex: 1,
    marginLeft: 8,
  },

  dropdown: {
    backgroundColor: '#5a3f26',
    borderRadius: 8,
    marginBottom: 12,
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#6b4b2a',
  },

  ownerText: {
    color: '#fff',
  },

  button: {
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
});
