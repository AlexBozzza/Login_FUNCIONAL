import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import API from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setLoading(true);

      const response = await API.post('/auth/login', {
        email,
        password,
      });

      await AsyncStorage.setItem('token', response.data.data.token);
      router.replace('/(tabs)');
    } catch (error) {
      alert('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f3d2e', '#1e6b3a']}
      style={styles.container}
    >
      <View style={[styles.card, isMobile && styles.cardMobile]}>

        {/* Imagen */}
        <Image
          source={require('../assets/images/login-cat.jpg')}
          style={[styles.image, isMobile && styles.imageMobile]}
        />

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>🐾 Veterinaria Rural</Text>
          <Text style={styles.subtitle}>
            Cuidado con corazón y tradición 🐕🐈
          </Text>

          <Text style={styles.label}>Correo</Text>
          <TextInput
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#b5d3c2"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#b5d3c2"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#245c3b',
    borderRadius: 14,
    overflow: 'hidden',
    width: '90%',
    maxWidth: 800,
  },

  cardMobile: {
    flexDirection: 'column',
  },

  image: {
    width: 260,
    height: 320,
  },

  imageMobile: {
    width: '100%',
    height: 220,
  },

  form: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffd166',
    marginBottom: 6,
  },

  subtitle: {
    color: '#e2f0e8',
    marginBottom: 20,
  },

  label: {
    color: '#e2f0e8',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#3fa36c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#f4a000',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2b2b2b',
    fontSize: 16,
  },
});
