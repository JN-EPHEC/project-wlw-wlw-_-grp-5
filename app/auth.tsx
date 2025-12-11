import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AuthScreen() {
  const router = useRouter();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: 'demo@mindly.app',
    password: 'Password123',
    confirmPassword: 'Password123',
    fullName: 'Invite Mindly',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '', confirmPassword: '', fullName: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email invalide';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mot de passe requis';
      isValid = false;
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Minimum 8 caractères';
      isValid = false;
    }

    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Nom requis';
        isValid = false;
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Confirmation requise';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const mapErrorMessage = (err: unknown) => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          return 'Email deja utilise.';
        case 'auth/invalid-email':
          return 'Email invalide.';
        case 'auth/weak-password':
          return 'Mot de passe trop court.';
        case 'auth/wrong-password':
          return 'Mot de passe incorrect.';
        case 'auth/user-not-found':
          return 'Compte introuvable.';
        default:
          return 'Une erreur est survenue. Veuillez reessayer.';
      }
    }
    if (err instanceof Error && err.message === 'EMAIL_NOT_VERIFIED') {
      return 'Verifie ton email avant de continuer. Un email de verification a ete envoye.';
    }
    return 'Une erreur est survenue. Veuillez reessayer.';
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        router.replace('/(tabs)');
      } else {
        await signup(formData.email, formData.password, formData.fullName);
        Alert.alert(
          'Verification email envoyee',
          'Verifie ta boite mail puis reconnecte-toi une fois confirme.'
        );
        setIsLogin(true);
      }
    } catch (error) {
      const message = mapErrorMessage(error);
      Alert.alert('Erreur', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Google', 'Connexion avec Google en cours...');
      // TODO: Intégrer Google OAuth
    }, 1000);
  };

  const handleAppleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Apple', 'Connexion avec Apple en cours...');
      // TODO: Intégrer Apple OAuth
    }, 1000);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };


  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter en mode demo.');
    } finally {
      setIsLoading(false);
    }
  };
  const renderPasswordInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    showPasswordState: boolean,
    setShowPasswordState: (value: boolean) => void,
    errorField: keyof typeof errors
  ) => (
    <View>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPasswordState}
          maxLength={100}
        />
        <TouchableOpacity
          onPress={() => setShowPasswordState(!showPasswordState)}
          style={styles.passwordToggle}
        >
          <IconSymbol
            name={showPasswordState ? 'eye.fill' : 'eye.slash.fill'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {errors[errorField] && (
        <Text style={styles.errorText}>{errors[errorField]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            {/* Header avec dégradé */}
            <LinearGradient
              colors={[theme.colors.headerGradient[0], theme.colors.headerGradient[1]]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.headerSection}
            >
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>M</Text>
                </View>
              </View>
              <Text style={styles.appTitle}>Mindly</Text>
              <Text style={styles.appSubtitle}>
                {isLogin ? 'Bienvenue à Mindly' : 'Rejoins Mindly'}
              </Text>
            </LinearGradient>

            {/* Formulaire */}
            <View style={styles.formSection}>
              {/* Tabs Login/Signup */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.tabActive]}
                  onPress={() => {
                    setIsLogin(true);
                    setFormData({ email: 'demo@mindly.app', password: 'Password123', confirmPassword: 'Password123', fullName: 'Invite Mindly' });
                    setErrors({ email: '', password: '', confirmPassword: '', fullName: '' });
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isLogin && styles.tabTextActive,
                    ]}
                  >
                    Connexion
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.tabActive]}
                  onPress={() => {
                    setIsLogin(false);
                    setFormData({ email: 'demo@mindly.app', password: 'Password123', confirmPassword: 'Password123', fullName: 'Invite Mindly' });
                    setErrors({ email: '', password: '', confirmPassword: '', fullName: '' });
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      !isLogin && styles.tabTextActive,
                    ]}
                  >
                    Inscription
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Champs du formulaire */}
              <View style={styles.formCard}>
                {/* Nom complet (Inscription seulement) */}
                {!isLogin && (
                  <>
                    <Text style={styles.fieldLabel}>Nom complet</Text>
                    <View style={styles.inputContainer}>
                      <IconSymbol name="person.fill" size={18} color={theme.colors.accent} />
                      <TextInput
                        style={styles.input}
                        placeholder="Votre nom complet"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={formData.fullName}
                        onChangeText={(text) => handleInputChange('fullName', text)}
                        maxLength={50}
                      />
                    </View>
                    {errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </>
                )}

                {/* Email */}
                <Text style={[styles.fieldLabel, !isLogin && { marginTop: 16 }]}>Email</Text>
                <View style={styles.inputContainer}>
                  <IconSymbol name="envelope.fill" size={18} color={theme.colors.accent} />
                  <TextInput
                    style={styles.input}
                    placeholder="votre@email.com"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Mot de passe */}
                <Text style={styles.fieldLabel}>Mot de passe</Text>
                {renderPasswordInput(
                  formData.password,
                  (text) => handleInputChange('password', text),
                  'Mot de passe (min 8 caractères)',
                  showPassword,
                  setShowPassword,
                  'password'
                )}
                {!isLogin && formData.password && isValidPassword(formData.password) && (
                  <Text style={styles.successText}>✓ Mot de passe valide</Text>
                )}

                {/* Confirmation mot de passe (Inscription seulement) */}
                {!isLogin && (
                  <>
                    <Text style={styles.fieldLabel}>Confirmer le mot de passe</Text>
                    {renderPasswordInput(
                      formData.confirmPassword,
                      (text) => handleInputChange('confirmPassword', text),
                      'Confirmez votre mot de passe',
                      showConfirmPassword,
                      setShowConfirmPassword,
                      'confirmPassword'
                    )}
                  </>
                )}

                {/* Lien "Mot de passe oublié" (Login seulement) */}
                {isLogin && (
                  <TouchableOpacity style={styles.forgotPasswordLink}>
                    <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                )}

                {/* Bouton principal */}
                <TouchableOpacity
                  style={[styles.authButton, isLoading && styles.authButtonDisabled]}
                  onPress={handleAuth}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.authButtonText}>
                    {isLoading
                      ? 'Chargement...'
                      : isLogin
                        ? 'Se connecter'
                        : 'S\'inscrire'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Séparateur */}
              <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>Ou</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Options OAuth */}
              <View style={styles.oauthContainer}>
                <Text style={styles.oauthTitle}>
                  {isLogin ? 'Connectez-vous avec' : 'Inscrivez-vous avec'}
                </Text>

                {/* Apple */}
                <TouchableOpacity
                  style={styles.appleButton}
                  onPress={handleAppleAuth}
                  activeOpacity={0.85}
                >
                  <Ionicons name="logo-apple" size={22} color="#fff" style={styles.appleIcon} />
                  <Text style={styles.appleText}>Se connecter avec Apple</Text>
                </TouchableOpacity>

                {/* Google */}
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleAuth}
                  activeOpacity={0.85}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.googleIcon} />
                  <Text style={styles.googleText}>Se connecter avec Google</Text>
                </TouchableOpacity>

              </View>

              {/* Lien d'Čchange */}
              <View style={styles.switchAuthContainer}>
                <Text style={styles.switchAuthText}>
                  {isLogin ? 'Pas encore de compte ? ' : 'Vous avez dČjŗ un compte ? '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: 'demo@mindly.app', password: 'Password123', confirmPassword: 'Password123', fullName: 'Invite Mindly' });
                    setErrors({ email: '', password: '', confirmPassword: '', fullName: '' });
                  }}
                >
                  <Text style={styles.switchAuthLink}>
                    {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Conditions d'utilisation */}
              <Text style={styles.termsText}>
                En continuant, vous acceptez nos{' '}
                <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{' '}
                <Text style={styles.termsLink}>Politique de confidentialitČ</Text>
              </Text>
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: theme.colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  passwordToggle: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
  },
  successText: {
    fontSize: 12,
    color: theme.colors.accent,
    marginTop: 6,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: theme.colors.accentLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  separatorText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  oauthContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  oauthTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 6,
    backgroundColor: '#000',
  },
  appleIcon: { fontSize: 20, color: '#fff', marginRight: 10 },
  appleText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  googleIcon: { fontSize: 20, color: '#DB4437', marginRight: 10 },
  googleText: { color: '#111', fontSize: 15, fontWeight: '700' },
  demoButton: {
    borderColor: theme.colors.accent,
  },
  demoButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchAuthText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  switchAuthLink: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  termsLink: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});










