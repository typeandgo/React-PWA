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