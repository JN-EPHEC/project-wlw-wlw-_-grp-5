import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileSettings() {
  // Exemple de données utilisateur
  const [name, setName] = useState('Melissa');
  const [email, setEmail] = useState('melissa@email.com');
  const [pseudo, setPseudo] = useState('melissa123');
  const [birthdate, setBirthdate] = useState('2000-01-01');
  const [photo, setPhoto] = useState('https://randomuser.me/api/portraits/women/44.jpg');

  // Simule la sauvegarde
  const handleSave = () => {
    // Ici, on pourrait envoyer les données à l'API
    alert('Modifications enregistrées !');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres du profil</Text>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: photo }} style={styles.avatar} />
        <TouchableOpacity style={styles.changePhotoBtn}>
          <Text style={styles.changePhotoText}>Changer la photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pseudo</Text>
        <TextInput style={styles.input} value={pseudo} onChangeText={setPseudo} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Date de naissance</Text>
        <TextInput style={styles.input} value={birthdate} onChangeText={setBirthdate} placeholder="YYYY-MM-DD" />
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Enregistrer</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eafcf3',
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f7f7fa',
  },
  saveBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
