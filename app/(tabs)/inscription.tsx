import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Inscription() {
  const [email, setEmail] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [birth, setBirth] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [cgu, setCgu] = useState(false);
  const [rgpd, setRgpd] = useState(false);

  const handleRegister = () => {
    alert(`Inscription\nEmail: ${email}\nPrénom: ${prenom}\nNom: ${nom}\nPseudo: ${pseudo}\nNaissance: ${birth}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Gérez vos connexions, en toute simplicité.</Text>
      <Text style={styles.desc}>Créez votre compte</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* Prénom */}
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
      />
      {/* Nom */}
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      {/* Pseudo */}
      <TextInput
        style={styles.input}
        placeholder="Pseudonyme (visible)"
        value={pseudo}
        onChangeText={setPseudo}
      />
      {/* Date de naissance */}
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (jj/mm/aaaa)"
        value={birth}
        onChangeText={setBirth}
        keyboardType="default"
      />
      {/* Mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Photo de profil */}
      <TouchableOpacity style={styles.photoBtn}>
        <Text style={styles.photoIcon}>📷</Text>
        <Text style={styles.photoText}>Sélectionner une photo...</Text>
      </TouchableOpacity>

      {/* CGU et RGPD */}
      <View style={styles.checkboxRow}>
        <TouchableOpacity onPress={()=>setCgu(!cgu)} style={styles.checkbox}>{cgu ? <Text>✔️</Text> : null}</TouchableOpacity>
        <Text style={styles.checkboxText}>J'accepte les <Text style={styles.link}>Conditions Générales d'Utilisation</Text></Text>
      </View>
      <View style={styles.checkboxRow}>
        <TouchableOpacity onPress={()=>setRgpd(!rgpd)} style={styles.checkbox}>{rgpd ? <Text>✔️</Text> : null}</TouchableOpacity>
        <Text style={styles.checkboxText}>J'ai lu et j'accepte la <Text style={styles.link}>Politique de Confidentialité (RGPD)</Text></Text>
      </View>

      {/* Bouton inscription */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Créer un compte</Text>
      </TouchableOpacity>

      {/* Lien connexion */}
      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Déjà un compte ? </Text>
        <TouchableOpacity><Text style={styles.signupLink}>Connectez-vous</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 2,
    color: '#222',
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    textAlign: 'left',
  },
  desc: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafbfc',
    fontSize: 15,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafbfc',
  },
  photoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  photoText: {
    color: '#444',
    fontSize: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#b7eacb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fafbfc',
  },
  checkboxText: {
    fontSize: 13,
    color: '#222',
    flex: 1,
  },
  link: {
    color: '#27ae60',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#b7eacb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#444',
    fontSize: 13,
  },
  signupLink: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 2,
  },
});
