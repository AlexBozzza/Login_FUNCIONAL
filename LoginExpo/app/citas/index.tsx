import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import API from '../../services/api';

export default function CitasScreen() {
  const [fecha, setFecha] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [citas, setCitas] = useState<any[]>([]);

  // 🔥 formatear fecha a YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // 🚀 cargar citas (REUTILIZABLE)
  const loadCitas = async (dateParam?: Date) => {
    try {
      setLoading(true);

      const dateToUse = dateParam || fecha;
      const fechaFormateada = formatDate(dateToUse);

      const response = await API.get(
        `/appointments?fecha=${fechaFormateada}`
      );

      setCitas(response.data.data || []);
    } catch (error: any) {
      console.error('Error cargando citas:', error?.response?.data || error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 cambio de fecha desde el picker
  const onChangeFecha = (_: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      setFecha(selectedDate);
      loadCitas(selectedDate); // ✅ recarga automática
    }
  };

  // 🚀 botón manual (lo dejamos por UX)
  const handleBuscar = () => {
    loadCitas();
  };

  // 🔥 cargar al entrar
  useEffect(() => {
    loadCitas(fecha);
  }, []);

  // 🎨 render de cada cita
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.hora}>🕒 {item.hora}</Text>
      <Text style={styles.text}>🐶 {item.paciente_nombre}</Text>
      <Text style={styles.text}>👤 {item.propietario_nombre}</Text>

      {item.motivo ? (
        <Text style={styles.motivo}>📝 {item.motivo}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Listado de citas</Text>

      {/* ✅ FECHA CLICKEABLE */}
      <Pressable
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="calendar-outline" size={18} color="#2b2b2b" />
        <Text style={styles.dateText}> {formatDate(fecha)}</Text>
      </Pressable>

      {/* ✅ PICKER */}
      {/* 📱 MOBILE PICKER */}
        {Platform.OS !== 'web' && showPicker && (
         <DateTimePicker
         value={fecha}
         mode="date"
        display="default"
         onChange={onChangeFecha}
  />
)}

{/* 🌐 WEB PICKER */}
{Platform.OS === 'web' && (
  <input
    type="date"
    value={formatDate(fecha)}
    onChange={(e) => {
      const newDate = new Date(e.target.value + 'T00:00:00');
      setFecha(newDate);
      loadCitas(newDate);
    }}
    style={{
      backgroundColor: '#f4a000',
      padding: 12,
      borderRadius: 8,
      border: 'none',
      marginBottom: 12,
      fontWeight: 'bold',
    }}
  />
)}


      {/* BOTÓN BUSCAR (opcional UX) */}
      <Pressable style={styles.button} onPress={handleBuscar}>
        <Ionicons name="search" size={18} color="#2b2b2b" />
        <Text style={styles.buttonText}>  Buscar citas</Text>
      </Pressable>

      {/* LISTA */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ffd166"
          style={{ marginTop: 30 }}
        />
      ) : citas.length === 0 ? (
        <Text style={styles.empty}>
          No hay citas para esta fecha
        </Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b2a1a',
    padding: 16,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  dateButton: {
    backgroundColor: '#f4a000',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  dateText: {
    color: '#2b2b2b',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#ffd166',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },

  buttonText: {
    color: '#2b2b2b',
    fontWeight: 'bold',
  },

  empty: {
    color: '#e8cfa3',
    textAlign: 'center',
    marginTop: 30,
  },

  card: {
    backgroundColor: '#6b4b2a',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  hora: {
    color: '#ffd166',
    fontWeight: 'bold',
    marginBottom: 4,
  },

  text: {
    color: '#fff',
  },

  motivo: {
    color: '#e8cfa3',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
