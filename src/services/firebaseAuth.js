const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
)

let sdkPromise
let authInstance

async function loadSdk() {
  if (!firebaseConfigured) return null
  if (!sdkPromise) {
    // Firebase's official docs support direct browser-module imports.
    // Vite is intentionally told to leave these URLs for the browser.
    const appUrl = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'
    const authUrl = 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js'
    sdkPromise = Promise.all([
      import(/* @vite-ignore */ appUrl),
      import(/* @vite-ignore */ authUrl)
    ])
  }
  return sdkPromise
}

async function getFirebaseAuth() {
  if (!firebaseConfigured) return null
  if (authInstance) return authInstance
  const [appSdk, authSdk] = await loadSdk()
  const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(firebaseConfig)
  authInstance = authSdk.getAuth(app)
  return authInstance
}

function friendlyAuthError(error) {
  const code = error?.code || ''
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/weak-password': 'Please use a stronger password (at least 6 characters).',
    'auth/network-request-failed': 'Firebase could not be reached. Check your internet connection.',
    'auth/operation-not-allowed': 'Enable Email/Password sign-in in Firebase Authentication first.'
  }
  return messages[code] || error?.message || 'Authentication failed. Please try again.'
}

export async function firebaseRegister(email, password, name) {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) return { ok: false, message: 'Firebase is not configured.' }
    const [, authSdk] = await loadSdk()
    const credential = await authSdk.createUserWithEmailAndPassword(auth, email, password)
    if (name) await authSdk.updateProfile(credential.user, { displayName: name })
    return {
      ok: true,
      user: {
        id: credential.user.uid,
        name: name || credential.user.displayName || email.split('@')[0],
        email: credential.user.email,
        role: 'user',
        provider: 'firebase'
      }
    }
  } catch (error) {
    return { ok: false, message: friendlyAuthError(error) }
  }
}

export async function firebaseLogin(email, password) {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) return { ok: false, message: 'Firebase is not configured.' }
    const [, authSdk] = await loadSdk()
    const credential = await authSdk.signInWithEmailAndPassword(auth, email, password)
    return {
      ok: true,
      user: {
        id: credential.user.uid,
        name: credential.user.displayName || credential.user.email?.split('@')[0] || 'Member',
        email: credential.user.email,
        role: 'user',
        provider: 'firebase'
      }
    }
  } catch (error) {
    return { ok: false, message: friendlyAuthError(error) }
  }
}

export async function firebaseLogout() {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) return
    const [, authSdk] = await loadSdk()
    await authSdk.signOut(auth)
  } catch {
    // Local session is cleared by the store even if the network is unavailable.
  }
}
