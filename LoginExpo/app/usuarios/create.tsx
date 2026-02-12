import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import API from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function CreateUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = () => {
    if (!name || !email || !password) {
      Alert.alert(
        'Campos requeridos',
        'Nombre, correo y contraseña son obligatorios'
      );
      return false;
    }
    return true;
  };

  const createUserRequest = async () => {
    try {
      console.log('Enviando datos al backend...');

      const response = await API.post('/users', {
        nombre: name,
        email: email,
        telefono: phone,
        password: password,
      });

      console.log('Respuesta:', response.data);

      Alert.alert('Éxito', 'Usuario creado correctamente');
      router.back();
    } catch (error: any) {
      console.log('ERROR COMPLETO:', error.response?.data);

      if (error.response?.data?.errors) {
        const messages = error.response.data.errors
          .map((e: any) => `• ${e.message}`)
          .join('\n');

        Alert.alert('Errores de validación', messages);
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'No se pudo crear el usuario');
      }
    }
  };

  const handleCreate = async () => {
  console.log('Botón presionado');

  if (!validateForm()) return;

  const confirm = window.confirm(
    `Se creará el usuario:\n\n👤 ${name}\n📧 ${email}\n📞 ${
      phone || 'No especificado'
    }\n\n¿Deseas continuar?`
  );

  if (!confirm) return;

  try {
    console.log('Enviando datos al backend...');

    const response = await API.post('/users', {
      nombre: name,
      email: email,
      telefono: phone,
      password: password,
    });

    console.log('Respuesta:', response.data);

    alert('Usuario creado correctamente');
    router.back();
  } catch (error: any) {
    console.log('ERROR COMPLETO:', error.response?.data);

    if (error.response?.data?.errors) {
      const messages = error.response.data.errors
        .map((e: any) => `• ${e.message}`)
        .join('\n');

      alert(messages);
    } else if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('No se pudo crear el usuario');
    }
  }
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffd166" />
        </Pressable>
        <Text style={styles.title}>Crear usuario</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Teléfono"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Botón */}
      <Pressable style={styles.button} onPress={handleCreate}>
        <Ionicons name="person-add" size={18} color="#2b2b2b" />
        <Text style={styles.buttonText}>  Crear usuario</Text>
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

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
