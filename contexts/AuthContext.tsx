import { auth, db } from '@/firebaseConfig';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  displayName?: string;
  moodHistory?: any[];
  anxietyJournal?: any[];
  activitiesCompleted?: any[];
  badges?: any[];
  preferences?: Record<string, any>;
  communitiesJoined?: string[];
  createdAt?: any;
  lastConnection?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  addMoodEntry: (payload: any) => Promise<void>;
  addAnxietyEntry: (payload: any) => Promise<void>;
  addActivityCompleted: (payload: any) => Promise<void>;
  addBadge: (payload: any) => Promise<void>;
  updatePreferences: (payload: Record<string, any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function sanitize(payload: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

async function fetchOrCreateProfile(user: FirebaseUser): Promise<UserProfile> {
  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);
  const baseProfile: UserProfile = {
    id: user.uid,
    email: user.email ?? '',
    fullName: user.displayName ?? '',
    avatar: user.photoURL ?? undefined,
    bio: '',
    interests: [],
  };

  if (!snapshot.exists()) {
    await setDoc(
      ref,
      sanitize({
        ...baseProfile,
        createdAt: serverTimestamp(),
        emailVerified: user.emailVerified,
      })
    );
    return baseProfile;
  }

  return { ...baseProfile, ...(snapshot.data() as Partial<UserProfile>) };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }
      const profile = await fetchOrCreateProfile(fbUser);
      setUser(profile);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      const error = new Error('EMAIL_NOT_VERIFIED');
      throw error;
    }
    const profile = await fetchOrCreateProfile(cred.user);
    await setDoc(
      doc(db, 'users', cred.user.uid),
      { lastConnection: serverTimestamp() },
      { merge: true }
    );
    setUser(profile);
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: fullName });
      await sendEmailVerification(cred.user);
      await setDoc(
        doc(db, 'users', cred.user.uid),
        sanitize({
          id: cred.user.uid,
          email,
          fullName,
          displayName: fullName,
          avatar: cred.user.photoURL ?? '',
          bio: '',
          interests: [],
          emailVerified: cred.user.emailVerified,
          createdAt: serverTimestamp(),
          lastConnection: serverTimestamp(),
          moodHistory: [],
          anxietyJournal: [],
          activitiesCompleted: [],
          badges: [],
          preferences: {},
          communitiesJoined: [],
        }),
        { merge: true }
      );
      const profile = await fetchOrCreateProfile(cred.user);
      setUser(profile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!auth.currentUser) return;
    const payload: any = {};
    if (data.fullName) payload.displayName = data.fullName;
    if (data.avatar) payload.photoURL = data.avatar;
    if (Object.keys(payload).length) {
      await updateProfile(auth.currentUser, payload);
    }
    await setDoc(
      doc(db, 'users', auth.currentUser.uid),
      sanitize({
        ...data,
        updatedAt: serverTimestamp(),
      }),
      { merge: true }
    );
    setUser((prev) =>
      prev
        ? {
            ...prev,
            ...data,
          }
        : null
    );
  };

  const guardUser = () => {
    if (!auth.currentUser || !user?.id) throw new Error('NOT_AUTHENTICATED');
  };

  const addMoodEntry = async (payload: any) => {
    guardUser();
    await setDoc(
      doc(db, 'users', user!.id),
      { moodHistory: arrayUnion({ ...payload, createdAt: serverTimestamp() }) },
      { merge: true }
    );
  };

  const addAnxietyEntry = async (payload: any) => {
    guardUser();
    await setDoc(
      doc(db, 'users', user!.id),
      { anxietyJournal: arrayUnion({ ...payload, createdAt: serverTimestamp() }) },
      { merge: true }
    );
  };

  const addActivityCompleted = async (payload: any) => {
    guardUser();
    await setDoc(
      doc(db, 'users', user!.id),
      { activitiesCompleted: arrayUnion({ ...payload, completedAt: serverTimestamp() }) },
      { merge: true }
    );
  };

  const addBadge = async (payload: any) => {
    guardUser();
    await setDoc(
      doc(db, 'users', user!.id),
      { badges: arrayUnion({ ...payload, earnedAt: serverTimestamp() }) },
      { merge: true }
    );
  };

  const updatePreferences = async (payload: Record<string, any>) => {
    guardUser();
    await setDoc(
      doc(db, 'users', user!.id),
      { preferences: payload },
      { merge: true }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        resetPassword,
        sendVerification,
        updateUserProfile,
        addMoodEntry,
        addAnxietyEntry,
        addActivityCompleted,
        addBadge,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
