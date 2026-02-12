import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import API from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function EditUserScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // valores originales para comparar
  const [originalNombre, setOriginalNombre] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalTelefono, setOriginalTelefono] = useState('');

  useEffect(() => {
    if (id) loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await API.get(`/users/${id}`);
      const user = response.data.data;

      setNombre(user.nombre);
      setEmail(user.email);
      setTelefono(user.telefono);

      setOriginalNombre(user.nombre);
      setOriginalEmail(user.email);
      setOriginalTelefono(user.telefono);

      setLoading(false);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el usuario');
    }
  };

  const handleUpdate = async () => {
    if (!nombre || !email || !telefono) {
      Alert.alert('Campos requeridos', 'Todos los campos son obligatorios');
      return;
    }

    // detectar cambios
    const cambios: string[] = [];

    if (nombre !== originalNombre) cambios.push('nombre');
    if (email !== originalEmail) cambios.push('correo');
    if (telefono !== originalTelefono) cambios.push('teléfono');

    if (cambios.length === 0) {
      Alert.alert('Sin cambios', 'No has modificado ningún dato');
      return;
    }

    const mensaje =
      cambios.length === 1
        ? `Estás a punto de editar el ${cambios[0]}. ¿Deseas continuar?`
        : `Estás a punto de editar los siguientes campos:\n\n• ${cambios.join(
            '\n• '
          )}\n\n¿Deseas continuar?`;

    // confirmación compatible con web
    const confirmar = window.confirm(mensaje);
    if (!confirmar) return;

    try {
      await API.put(`/users/${id}`, {
        nombre,
        email,
        telefono,
      });

      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
          Cargando usuario...
        </Text>
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
        <Text style={styles.title}>Editar usuario</Text>
      </View>

      {/* Formulario */}
      <View style={styles.card}>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#d8cfc4"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
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
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
      </View>

      {/* Botón */}
      <Pressable style={styles.button} onPress={handleUpdate}>
        <Ionicons name="save" size={18} color="#2b2b2b" />
        <Text style={styles.buttonText}>  Guardar cambios</Text>
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
