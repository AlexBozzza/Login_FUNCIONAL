import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import API from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function EditOwnerScreen() {
  const { id } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOwner();
  }, []);

  const loadOwner = async () => {
    try {
      const response = await API.get(`/owners/${id}`);
      const owner = response.data.data;

      setName(owner.name || '');
      setEmail(owner.email || '');
      setPhone(owner.phone || '');
      setAddress(owner.address || '');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el propietario');
      router.back();
    }
  };

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Nombre y correo son obligatorios');
      return;
    }

    try {
      setLoading(true);

      await API.put(`/owners/${id}`, {
        name,
        email,
        phone,
        address,
      });

      Alert.alert('Éxito', 'Propietario actualizado correctamente');
      router.replace({
      pathname: '/propietarios/[id]',
      params: { id: id as string },
    });

    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el propietario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Editar Propietario</Text>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#cbb28a"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#cbb28a"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Teléfono"
          placeholderTextColor="#cbb28a"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="Dirección"
          placeholderTextColor="#cbb28a"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Button */}
      <Pressable style={styles.button} onPress={handleUpdate} disabled={loading}>
        <Ionicons name="save" size={18} color="#2b2b2b" />
        <Text style={styles.buttonText}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Text>
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
    marginBottom: 20,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#6b4b2a',
    borderRadius: 12,
    padding: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#8b5e34',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#f4a000',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  buttonText: {
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
});
