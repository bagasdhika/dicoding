/* =========================================================
   PUSH NOTIFICATION HELPER – FINAL STABLE
   ✔ Submission 1 tidak hilang
   ✔ Submission 2 subscribe/unsubscribe
   ✔ Compatible dengan api.js
   ✔ Tidak error expirationTime
   ✔ Aman untuk toggle push
   ========================================================= */

/* =========================================================
   CEK SUPPORT PUSH
   ========================================================= */
export const isPushSupported = () =>
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

/* =========================================================
   REQUEST PERMISSION  (WAJIB USER GESTURE)
   ========================================================= */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('Browser tidak mendukung notifikasi');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/* =========================================================
   UTIL: Base64 → Uint8Array (WAJIB UNTUK VAPID)
   ========================================================= */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

/* =========================================================
   VAPID PUBLIC KEY – RESMI DICODING
   ========================================================= */
const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

/* =========================================================
   GET CURRENT SUBSCRIPTION
   ========================================================= */
export const getPushSubscription = async () => {
  if (!isPushSupported()) return null;

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
};

/* =========================================================
   NORMALIZE SUBSCRIPTION
   ✔ Hilangkan expirationTime
   ✔ Format sesuai API Dicoding
   ========================================================= */
export const normalizeSubscription = (subscription) => {
  if (!subscription) return null;

  const json = subscription.toJSON();

  return {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    },
  };
};

/* =========================================================
   SUBSCRIBE PUSH NOTIFICATION
   ========================================================= */
export const subscribePushNotification = async () => {
  if (!isPushSupported()) {
    throw new Error('Push Notification tidak didukung browser');
  }

  // WAJIB USER GESTURE
  const granted = await requestNotificationPermission();
  if (!granted) {
    throw new Error('Izin notifikasi tidak diberikan');
  }

  const registration = await navigator.serviceWorker.ready;

  // CEGAH DOUBLE SUBSCRIBE
  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  return subscription;
};

/* =========================================================
   UNSUBSCRIBE PUSH NOTIFICATION
   ========================================================= */
export const unsubscribePushNotification = async () => {
  const subscription = await getPushSubscription();
  if (!subscription) return false;

  try {
    await subscription.unsubscribe();
    return true;
  } catch (err) {
    console.error('Unsubscribe gagal:', err);
    return false;
  }
};
