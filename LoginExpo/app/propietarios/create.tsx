import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import API from '../../services/api';

export default function CreateOwnerScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Nombre y correo son obligatorios');
      return;
    }

    try {
      await API.post('/owners', {
        name,
        email,
        phone,
        address,
      });

      Alert.alert('Éxito', 'Propietario creado correctamente');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el propietario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Propietario</Text>

      <TextInput
        placeholder="Nombre completo"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Dirección"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar 🐾</Text>
      </Pressable>
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
    color: '#ffd166',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#5a3f26',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
});
