import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Connexion() {
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    alert(`Connexion\nEmail: ${email}\nTéléphone: ${phone}\nIdentifiant: ${username}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>
      <Text style={styles.subtitle}>Connectez-vous ou créez un compte</Text>
      <Text style={styles.desc}>Profitez de toutes les fonctionnalités en quelques étapes seulement.</Text>

      {/* Onglets */}
      <View style={styles.tabsRow}>
        <Pressable style={[styles.tab, tab==='email'&&styles.tabActive]} onPress={()=>setTab('email')}><Text style={tab==='email'?styles.tabTextActive:styles.tabText}>E-mail</Text></Pressable>
        <Pressable style={[styles.tab, tab==='phone'&&styles.tabActive]} onPress={()=>setTab('phone')}><Text style={tab==='phone'?styles.tabTextActive:styles.tabText}>Téléphone</Text></Pressable>
        <Pressable style={[styles.tab, tab==='username'&&styles.tabActive]} onPress={()=>setTab('username')}><Text style={tab==='username'?styles.tabTextActive:styles.tabText}>Identifiant</Text></Pressable>
      </View>

      {/* Champs selon onglet */}
      {tab==='email' && (
        <TextInput
          style={styles.input}
          placeholder="Adresse e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      )}
      {tab==='phone' && (
        <TextInput
          style={styles.input}
          placeholder="Numéro de téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      )}
      {tab==='username' && (
        <TextInput
          style={styles.input}
          placeholder="Identifiant"
          value={username}
          onChangeText={setUsername}
        />
      )}

      {/* Mot de passe avec icône */}
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, {flex:1}]}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={()=>setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Text>{showPassword ? '🙈' : '👁️'}</Text>
        </Pressable>
      </View>
      <TouchableOpacity><Text style={styles.forgot}>Mot de passe oublié ?</Text></TouchableOpacity>

      {/* Bouton vert */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      {/* Séparateur */}
      <View style={styles.separatorRow}><View style={styles.separator}/><Text style={styles.separatorText}>ou</Text><View style={styles.separator}/></View>

      {/* Bouton Apple */}
      <TouchableOpacity style={styles.appleBtn}>
        <Text style={styles.appleIcon}></Text>
        <Text style={styles.appleText}>Connexion avec Apple</Text>
      </TouchableOpacity>

      {/* Lien inscription */}
      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Vous n'avez pas de compte ? </Text>
        <TouchableOpacity><Text style={styles.signupLink}>Créer un compte</Text></TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    color: '#222',
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
    color: '#444',
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: '#e6e6e6',
  },
  tabText: {
    color: '#444',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#222',
    fontWeight: 'bold',
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 4,
  },
  forgot: {
    color: '#27ae60',
    fontSize: 13,
    marginBottom: 16,
    marginLeft: 2,
  },
  button: {
    backgroundColor: '#27ae60',
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
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  separatorText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 13,
  },
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    marginBottom: 8,
  },
  appleIcon: {
    color: '#fff',
    fontSize: 18,
    marginRight: 8,
  },
  appleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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
