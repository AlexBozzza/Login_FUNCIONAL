import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import API from '../../services/api';

export default function CreateAppointmentScreen() {
  const [fecha, setFecha] = useState(new Date());
  const [fechaWeb, setFechaWeb] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showPicker, setShowPicker] = useState(false);

  const [owners, setOwners] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);

  const [ownerId, setOwnerId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);

  // 🔥 TOAST STATE
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });

    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2500);
  };

  const formatDate = (date: Date) =>
    date.toISOString().split('T')[0];

  // 🔥 generar horas válidas
  const generateHours = () => {
    const hours: string[] = [];
    let current = 9 * 60;
    const end = 17 * 60 + 30;

    while (current <= end) {
      const h = Math.floor(current / 60)
        .toString()
        .padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      hours.push(`${h}:${m}:00`);
      current += 30;
    }

    return hours;
  };

  const hoursList = generateHours();

  // 🚀 cargar owners
  useEffect(() => {
    loadOwners();
  }, []);

  // 🚀 cargar horas ocupadas cuando cambia fecha
  useEffect(() => {
    loadOccupiedHours(formatDate(fecha));
  }, [fecha]);

  const loadOwners = async () => {
    try {
      const res = await API.get('/owners');
      setOwners(res.data.data || []);
    } catch (err) {
      showToast('No se pudieron cargar propietarios', 'error');
    }
  };

  const loadPatients = async (ownerId: string) => {
    try {
      const res = await API.get(`/patients?owner_id=${ownerId}`);
      setPatients(res.data.data || []);
    } catch (err) {
      showToast('No se pudieron cargar pacientes', 'error');
    }
  };

  // 🔥 cargar horas ocupadas
  const loadOccupiedHours = async (dateStr: string) => {
    try {
      const res = await API.get(`/appointments?fecha=${dateStr}`);
      const hours = res.data?.data?.map((a: any) => a.hora) || [];
      setOccupiedHours(hours);
    } catch (err) {
      console.log('Error cargando horas ocupadas');
    }
  };

  // 🔥 validar horas pasadas
  const isPastHour = (hourStr: string) => {
    const todayStr = formatDate(new Date());
    const selectedStr = formatDate(fecha);

    if (todayStr !== selectedStr) return false;

    const now = new Date();
    const [h, m] = hourStr.split(':').map(Number);

    const slotTime = new Date();
    slotTime.setHours(h, m, 0, 0);

    return slotTime <= now;
  };

  // 🚀 CREAR CITA
  const handleCreate = async () => {
    if (!ownerId) {
      showToast('Falta propietario', 'error');
      return;
    }

    if (!patientId) {
      showToast('Falta mascota', 'error');
      return;
    }

    if (!hora) {
      showToast('Falta hora', 'error');
      return;
    }

    try {
      setSaving(true);

      const res = await API.post('/appointments', {
        owner_id: ownerId,
        patient_id: patientId,
        fecha: formatDate(fecha),
        hora,
        motivo,
      });

      showToast('Cita creada correctamente', 'success');

      await loadOccupiedHours(formatDate(fecha));

      setHora('');
      setMotivo('');
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          'No se pudo crear la cita',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva cita</Text>

      {/* 📅 FECHA */}
      <Text style={styles.label}>Fecha</Text>

      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.input}
          value={fechaWeb}
          onChangeText={(text) => {
            setFechaWeb(text);
            setFecha(new Date(text));
          }}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#d8cfc4"
        />
      ) : (
        <>
          <Pressable
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: '#fff' }}>
              📅 {formatDate(fecha)}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              onChange={(_, d) => {
                setShowPicker(false);
                if (d) setFecha(d);
              }}
            />
          )}
        </>
      )}

      {/* 👤 PROPIETARIO */}
      <Text style={styles.label}>Propietario</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ownerId}
          onValueChange={(value) => {
            setOwnerId(value);
            setPatientId('');
            loadPatients(value);
          }}
          dropdownIconColor="#ffd166"
          style={styles.picker}
          itemStyle={{ color: '#000' }}
        >
          <Picker.Item label="Seleccionar propietario..." value="" />
          {owners.map((o) => (
            <Picker.Item
              key={o.id}
              label={o.name}
              value={String(o.id)}
            />
          ))}
        </Picker>
      </View>

      {/* 🐶 MASCOTA */}
      <Text style={styles.label}>Mascota</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={patientId}
          onValueChange={(value) => setPatientId(value)}
          enabled={!!ownerId}
          dropdownIconColor="#ffd166"
          style={styles.picker}
          itemStyle={{ color: '#000' }}
        >
          <Picker.Item label="Seleccionar mascota..." value="" />
          {patients.map((p) => (
            <Picker.Item
              key={p.id}
              label={p.name}
              value={String(p.id)}
            />
          ))}
        </Picker>
      </View>

      {/* ⏰ HORA */}
      <Text style={styles.label}>Hora</Text>
      <View style={styles.hoursContainer}>
        {hoursList.map((h) => {
          const isOccupied = occupiedHours.includes(h);
          const isPast = isPastHour(h);
          const disabled = isOccupied || isPast;

          return (
            <Pressable
              key={h}
              disabled={disabled}
              style={[
                styles.hourBtn,
                hora === h && styles.hourSelected,
                disabled && { opacity: 0.3 },
              ]}
              onPress={() => setHora(h)}
            >
              <Text style={{ color: '#fff' }}>
                {h.slice(0, 5)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 📝 MOTIVO */}
      <TextInput
        placeholder="Motivo (opcional)"
        placeholderTextColor="#d8cfc4"
        style={styles.input}
        value={motivo}
        onChangeText={setMotivo}
      />

      {/* ✅ BOTÓN */}
      <Pressable
        style={[styles.button, saving && { opacity: 0.6 }]}
        onPress={handleCreate}
        disabled={saving}
      >
        <Ionicons name="calendar" size={18} color="#2b2b2b" />
        <Text style={styles.buttonText}>
          {saving ? '  Guardando...' : '  Agendar cita'}
        </Text>
      </Pressable>

      {/* 🔥 TOAST */}
      {toast.visible && (
        <View
          style={[
            styles.toast,
            toast.type === 'success'
              ? styles.toastSuccess
              : styles.toastError,
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
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
  input: {
    backgroundColor: '#6b4b2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: '#fff',
  },
  label: {
    color: '#ffd166',
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: '#6b4b2a',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#6b4b2a',
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  hourBtn: {
    backgroundColor: '#5a3f26',
    padding: 8,
    borderRadius: 6,
  },
  hourSelected: {
    backgroundColor: '#f4a000',
  },
  button: {
    backgroundColor: '#ffd166',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#2b2b2b',
    fontWeight: 'bold',
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  toastSuccess: {
    backgroundColor: '#2ecc71',
  },
  toastError: {
    backgroundColor: '#e74c3c',
  },
  toastText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});