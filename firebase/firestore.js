import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  setDoc,
  serverTimestamp, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./config.js";

// Products Fetching
export const fetchProducts = async () => {
  try {
    const colRef = collection(db, "products");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

// Orders Management
export const createOrderInDB = async (orderData) => {
  const ordersRef = collection(db, "orders");
  const payload = {
    ...orderData,
    status: "Pending",
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(ordersRef, payload);
  return docRef.id;
};

export const subscribeUserOrders = (userId, callback) => {
  const q = query(
    collection(db, "orders"), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  }, (error) => {
    console.error("Order listener error:", error);
  });
};

// User Profile Sync
export const fetchUserProfile = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
};
