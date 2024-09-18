import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyD35dhnviwQyVqrnLYAunROtgMGIb3YeFw',
  authDomain: 'books-d4e97.firebaseapp.com',
  databaseURL: 'https://books-d4e97-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'books-d4e97',
  storageBucket: 'books-d4e97.appspot.com',
  messagingSenderId: '991112835080',
  appId: '1:991112835080:web:b7d0f6da79aefe47ea21bd',
  measurementId: 'G-6XCRD2VVXK',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export {
  auth,
  db,
  storage,
  messaging,
  getToken,
  onMessage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};

export const addBook = async (formData, id) => {
  try {
    const { title, author, image, price } = formData;
    const imageRef = storageRef(storage, `images/${image[0].name}`);
    await uploadBytes(imageRef, image[0]);
    const imageUrl = await getDownloadURL(imageRef);
    const bookRef = doc(db, 'books', id);
    await setDoc(bookRef, {
      id,
      title,
      author,
      imageUrl,
      price,
    });
    console.log('Book added successfully');
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const getData = async () => {
  const booksCollection = collection(db, 'books');
  const querySnapshot = await getDocs(booksCollection);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export async function deleteBook(id) {
  try {
    const bookRef = doc(db, 'books', id);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}
export const checkIfAdmin = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.isAdmin === true;
    } else {
      console.log(`No such document for userId: ${userId}`);
      return false; // No document found, return false
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false; // On error, assume not an admin
  }
};

export const addOrder = async (book, nickname) => {
  try {
    const orderData = {
      bookId: book.id || 'unknown',
      title: book.title || 'Untitled',
      author: book.author || 'Unknown Author',
      price: book.price || 0,
      user: nickname || 'Anonymous',
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'orders'), orderData);
    console.log('Order added successfully');
  } catch (error) {
    console.error('Error adding order:', error);
  }
};

export const fetchOrders = async () => {
  const ordersCollection = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCollection);
  const orderList = orderSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return orderList;
};

export const uploadImage = async (image) => {
  const imageRef = storageRef(storage, `images/${image.name}`);
  await uploadBytes(imageRef, image);
  const imageUrl = await getDownloadURL(imageRef);
  return imageUrl;
};

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey:
          'BLo7F7jgWAI7zAyMs1EiDXFvFsXHjAjZORiW_7HKU8YEacB6fF5F3lBZqNZYdE8Pvpn7-U2sY_4fMUvjQGiKujg',
      });
      return token;
    } else {
      throw new Error('Notification permission not granted');
    }
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
};
