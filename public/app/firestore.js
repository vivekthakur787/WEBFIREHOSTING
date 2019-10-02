// *********************************************************************	
// Initialize Firebase
// *********************************************************************	
let config = {
    apiKey: "AIzaSyA8iM8_TtIyrWEqJxJCWBTN8GGuhhYXnig",
    authDomain: "template-8dd7f.firebaseapp.com",
    databaseURL: "https://template-8dd7f.firebaseio.com",
    projectId: "template-8dd7f",
    storageBucket: "template-8dd7f.appspot.com",
    messagingSenderId: "735281577199",
    appId: "1:735281577199:web:49b9c28a9d3e6bff"
};

firebase.initializeApp(config);
let firestore = firebase.firestore();
let db = firebase.firestore();
console.log("Cloud Firestores Loaded");


// *********************************************************************	
// Enable offline capabilities
// *********************************************************************	
firebase.firestore().enablePersistence()
    .then(function() {
        // Initialize Cloud Firestore through firebase
        var db = firebase.firestore();
    })
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a a time.
            console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");

        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
            console.log("The current browser does not support all of the eatures required to enable persistence");
        }
    });



// *********************************************************************
// DELETE COLLECTION
// *********************************************************************
// [START delete_collection]
function deleteCollection(collectionPath, batchSize) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

// [END delete_collection]



