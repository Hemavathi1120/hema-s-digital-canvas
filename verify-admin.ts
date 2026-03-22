// Quick script to verify and fix admin access
import { auth, db } from './src/integrations/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'saidhuhema11@gmail.com';
const ADMIN_PASSWORD = '1234567890';

async function verifyAdmin() {
  try {
    console.log('🔄 Signing in...');

    const userCredential = await signInWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    const user = userCredential.user;
    console.log('✅ Signed in successfully');
    console.log('User ID:', user.uid);
    console.log('Email:', user.email);

    // Check if admin role exists
    const userRolesRef = collection(db, 'userRoles');
    const q = query(
      userRolesRef,
      where('userId', '==', user.uid),
      where('role', '==', 'admin')
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('❌ Admin role NOT found in userRoles collection');
      console.log('🔄 Adding admin role...');

      await addDoc(collection(db, 'userRoles'), {
        userId: user.uid,
        role: 'admin',
        createdAt: Timestamp.now(),
      });

      console.log('✅ Admin role added successfully!');
    } else {
      console.log('✅ Admin role found in userRoles collection');
      querySnapshot.forEach((doc) => {
        console.log('Role document:', doc.id, doc.data());
      });
    }

    console.log('\n🎉 Admin access verified!');
    console.log('You can now access: http://localhost:8082/admin/login');

    await auth.signOut();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);

    if (error.code === 'auth/user-not-found') {
      console.log('\n⚠️  User does not exist. Run: npm run setup-admin');
    } else if (error.code === 'auth/wrong-password') {
      console.log('\n⚠️  Wrong password');
    }

    process.exit(1);
  }
}

verifyAdmin();
