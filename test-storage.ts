// Test Firebase Storage connectivity
import { storage, auth } from './src/integrations/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';

const ADMIN_EMAIL = 'saidhuhema11@gmail.com';
const ADMIN_PASSWORD = '1234567890';

async function testStorageUpload() {
  try {
    console.log('🔄 Signing in...');
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Signed in as:', userCredential.user.email);
    console.log('User ID:', userCredential.user.uid);
    
    console.log('\n🔄 Testing storage upload...');
    
    // Create a test file (1x1 pixel PNG)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const blob = await (await fetch(`data:image/png;base64,${testImageData}`)).blob();
    
    const userId = userCredential.user.uid;
    const fileName = `test/${userId}/test-${Date.now()}.png`;
    const storageRef = ref(storage, fileName);
    
    console.log('Uploading test file to:', fileName);
    await uploadBytes(storageRef, blob);
    console.log('✅ Upload successful!');
    
    console.log('🔄 Getting download URL...');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Download URL:', downloadURL);
    
    console.log('\n🎉 Storage is working correctly!');
    console.log('You can now upload images in the admin dashboard.');
    
    await auth.signOut();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Storage test failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'storage/unauthorized') {
      console.log('\n⚠️  SOLUTION: Configure Firebase Storage rules');
      console.log('1. Go to: https://console.firebase.google.com/');
      console.log('2. Select project: portfolio-a2172');
      console.log('3. Go to: Storage → Rules');
      console.log('4. Use the rules from storage.rules file');
      console.log('5. Click "Publish"');
      console.log('\nSee FIREBASE_STORAGE_SETUP.md for detailed instructions.');
    } else if (error.code === 'storage/unknown') {
      console.log('\n⚠️  Storage might not be enabled');
      console.log('1. Go to: https://console.firebase.google.com/');
      console.log('2. Select project: portfolio-a2172');
      console.log('3. Go to: Storage');
      console.log('4. Click "Get Started" if prompted');
    }
    
    process.exit(1);
  }
}

testStorageUpload();
