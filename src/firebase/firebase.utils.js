import firebase from 'firebase/app';
import 'firebase/firestore'; // database
import 'firebase/auth'; // authentication

const config = {
    apiKey: "AIzaSyDILs6vIhVNfO3jRBSCHUcW0sT9x1-D2uI",
    authDomain: "hipstr-db.firebaseapp.com",
    projectId: "hipstr-db",
    storageBucket: "hipstr-db.appspot.com",
    messagingSenderId: "100210754804",
    appId: "1:100210754804:web:9446059ac7f4c08b854aa1",
    measurementId: "G-7G5ZHJTWND"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Google authentication utility
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account'});
// triggers the google pop-up whenever
// using this provider, for authentication and sign in


export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase; // in case the whole library is needed