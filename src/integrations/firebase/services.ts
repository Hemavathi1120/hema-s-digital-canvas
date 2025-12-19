import { db, auth } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import type {
  Profile,
  Project,
  Education,
  Experience,
  Skill,
  Achievement,
} from './types';

// Helper to get current user ID
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

// Generic CRUD Operations
export const createDocument = async <T extends Record<string, any>>(
  collectionName: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
): Promise<string> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const docData = {
    ...data,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, collectionName), docData);
  return docRef.id;
};

export const updateDocument = async <T extends Record<string, any>>(
  collectionName: string,
  id: string,
  data: Partial<Omit<T, 'id' | 'createdAt' | 'userId'>>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  requireAuth: boolean = false
): Promise<T[]> => {
  const userId = getCurrentUserId();
  
  // If auth is not required, fetch all documents with constraints
  if (!requireAuth || !userId) {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  // If auth is required, filter by userId only (no orderBy to avoid composite index requirement)
  // Sorting will be done in JavaScript after fetching
  const collectionRef = collection(db, collectionName);
  const q = query(
    collectionRef,
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

// Specific Collection Operations
export const projectsService = {
  getAll: () => getDocuments<Project>('projects', [], true),
  getAllPublic: () => getDocuments<Project>('projects', [], false),
  getById: (id: string) => getDocument<Project>('projects', id),
  create: (data: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    createDocument<Project>('projects', data),
  update: (id: string, data: Partial<Project>) =>
    updateDocument<Project>('projects', id, data),
  delete: (id: string) => deleteDocument('projects', id),
};

export const educationService = {
  getAll: () => getDocuments<Education>('education', [], true),
  getAllPublic: () => getDocuments<Education>('education', [], false),
  getById: (id: string) => getDocument<Education>('education', id),
  create: (data: Omit<Education, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    createDocument<Education>('education', data),
  update: (id: string, data: Partial<Education>) =>
    updateDocument<Education>('education', id, data),
  delete: (id: string) => deleteDocument('education', id),
};

export const experiencesService = {
  getAll: async (type?: 'work' | 'leadership') => {
    const allExperiences = await getDocuments<Experience>('experiences', [], true);
    if (type) {
      return allExperiences.filter(exp => exp.type === type);
    }
    return allExperiences;
  },
  getAllPublic: async (type?: 'work' | 'leadership') => {
    const allExperiences = await getDocuments<Experience>('experiences', [], false);
    if (type) {
      return allExperiences.filter(exp => exp.type === type);
    }
    return allExperiences;
  },
  getById: (id: string) => getDocument<Experience>('experiences', id),
  create: (data: Omit<Experience, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    createDocument<Experience>('experiences', data),
  update: (id: string, data: Partial<Experience>) =>
    updateDocument<Experience>('experiences', id, data),
  delete: (id: string) => deleteDocument('experiences', id),
};

export const skillsService = {
  getAll: () => getDocuments<Skill>('skills', [], true),
  getAllPublic: () => getDocuments<Skill>('skills', [], false),
  getById: (id: string) => getDocument<Skill>('skills', id),
  create: (data: Omit<Skill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    createDocument<Skill>('skills', data),
  update: (id: string, data: Partial<Skill>) =>
    updateDocument<Skill>('skills', id, data),
  delete: (id: string) => deleteDocument('skills', id),
};

export const achievementsService = {
  getAll: () => getDocuments<Achievement>('achievements', [], true),
  getAllPublic: () => getDocuments<Achievement>('achievements', [], false),
  getById: (id: string) => getDocument<Achievement>('achievements', id),
  create: (data: Omit<Achievement, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
    createDocument<Achievement>('achievements', data),
  update: (id: string, data: Partial<Achievement>) =>
    updateDocument<Achievement>('achievements', id, data),
  delete: (id: string) => deleteDocument('achievements', id),
};

export const profilesService = {
  getCurrent: async (): Promise<Profile | null> => {
    const profiles = await getDocuments<Profile>('profiles', [], false);
    return profiles[0] || null;
  },
  update: async (data: Partial<Profile>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const profiles = await getDocuments<Profile>('profiles', []);
    if (profiles.length > 0) {
      await updateDocument<Profile>('profiles', profiles[0].id, data);
    } else {
      await createDocument<Profile>('profiles', data as any);
    }
  },
};
