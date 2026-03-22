// Firebase Admin User Setup Script
// Run this script once to create your admin user

import { auth, db } from './src/integrations/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'saidhuhema11@gmail.com';
const ADMIN_PASSWORD = '1234567890';

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    const user = userCredential.user;
    console.log('✅ User created in Authentication:', user.uid);

    // Check if user role already exists
    const userRolesRef = collection(db, 'userRoles');
    const q = query(userRolesRef, where('userId', '==', user.uid));
    const existingRoles = await getDocs(q);

    if (!existingRoles.empty) {
      console.log('⚠️  User role already exists');
      return;
    }

    // Add admin role to Firestore
    await addDoc(collection(db, 'userRoles'), {
      userId: user.uid,
      role: 'admin',
      createdAt: Timestamp.now(),
    });

    console.log('✅ Admin role assigned in Firestore');
    console.log('\n🎉 Admin user created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('\n🔗 Login URL: http://localhost:5173/admin/login');

    process.exit(0);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  User already exists in Authentication');
      console.log('🔄 Checking if admin role is assigned...');

      // Sign in to get user ID
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(
        auth,
        ADMIN_EMAIL,
        ADMIN_PASSWORD
      );

      const user = userCredential.user;

      // Check and add admin role if missing
      const userRolesRef = collection(db, 'userRoles');
      const q = query(userRolesRef, where('userId', '==', user.uid));
      const existingRoles = await getDocs(q);

      if (existingRoles.empty) {
        await addDoc(collection(db, 'userRoles'), {
          userId: user.uid,
          role: 'admin',
          createdAt: Timestamp.now(),
        });
        console.log('✅ Admin role assigned');
      } else {
        console.log('✅ Admin role already assigned');
      }

      console.log('\n📝 Login Credentials:');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Password:', ADMIN_PASSWORD);
      console.log('\n🔗 Login URL: http://localhost:5173/admin/login');

      process.exit(0);
    } else {
      console.error('❌ Error creating admin user:', error.message);
      process.exit(1);
    }
  }
}

createAdminUser();
