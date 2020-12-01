var DB_NAME = 'feeds-store';
var DB_RIGHTS = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite'
};
var STORE_NAME = 'feeds';
var KEY_PATH = 'id';

// Create IndexedDB Store
var dbPromise = idb.openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: KEY_PATH});
  },
});

// Write to Store
function writeData(data) {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(STORE_NAME, DB_RIGHTS.READ_WRITE);
    var store = tx.objectStore(STORE_NAME);
    await store.put(data);
    return await tx.done;
  })
};

function readAllData() {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(STORE_NAME, DB_RIGHTS.READ_ONLY);
    var store = tx.objectStore(STORE_NAME);
    return await store.getAll();
  })
};

function clearAllData() {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(STORE_NAME, DB_RIGHTS.READ_WRITE);
    var store = tx.objectStore(STORE_NAME);
    await store.clear();
    return await tx.done;
  })
};

function deleteData(id) {
  return dbPromise.then(async function(db) {
    var tx = db.transaction(STORE_NAME, DB_RIGHTS.READ_WRITE);
    var store = tx.objectStore(STORE_NAME);
    await store.delete(id);
    return await tx.done;
  })
};