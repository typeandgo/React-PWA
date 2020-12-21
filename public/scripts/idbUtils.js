var DB_NAME = 'feeds-store';
var DB_RIGHTS = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite'
};

// Create IndexedDB Store
var dbPromise = idb.openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore('feeds', { keyPath: 'id'}); // For general use
    db.createObjectStore('sync-feeds', { keyPath: 'id'}); // For background sync
  },
});

// Write to Store
function writeData(storeName, data) {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(storeName, DB_RIGHTS.READ_WRITE);
    var store = tx.objectStore(storeName);
    await store.put(data);
    return await tx.done;
  })
};

function readAllData(storeName) {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(storeName, DB_RIGHTS.READ_ONLY);
    var store = tx.objectStore(storeName);
    return await store.getAll();
  })
};

function clearAllData(storeName) {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(storeName, DB_RIGHTS.READ_WRITE);
    var store = tx.objectStore(storeName);
    await store.clear();
    return await tx.done;
  })
};

function deleteData(storeName, id) {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(storeName, DB_RIGHTS.READ_WRITE);
    var store = tx.objectStore(storeName);
    await store.delete(id);
    return await tx.done;
  })
};

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
