
        // Initialize Firebase
        const config = {
          apiKey: "AIzaSyCV7RRr0sAc-lF3MRXUlcqBK4z4E1dMqDg",
          authDomain: "bookmarker-5c180.firebaseapp.com",
          databaseURL: "https://bookmarker-5c180.firebaseio.com",
          projectId: "bookmarker-5c180",
          storageBucket: "bookmarker-5c180.appspot.com",
          messagingSenderId: "298440714264"
        };
        firebase.initializeApp(config);
        const database = firebase.database();

/* --------------------------------------------------------------------------------
            getting DOM elements
---------------------------------------------------------------------------------------- */
const txtemail = document.getElementById('txtemail');
const txtpass = document.getElementById('txtpass');
const btnlogin = document.getElementById('btnlogin');
const btnsubmit = document.getElementById('btnsubmit');
const btnsignout = document.getElementById('btnsignout');
const bookForm = document.getElementById('bookForm');
let bookmarkResult = document.getElementById('results');
const auth = firebase.auth();
/* --------------------------------------------------------------------------------
            Login events
---------------------------------------------------------------------------------------- */
if(btnlogin){
    btnlogin.addEventListener("click", e =>{
        let email = txtemail.value;
        let pass = txtpass.value;
        const auth = firebase.auth();

        //signin
        firebase.auth().signInWithEmailAndPassword(email, pass).then(function(){
            authChange();
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            
            console.log(errorMessage);
        });
        
    });
}
/* --------------------------------------------------------------------------------
            Register
---------------------------------------------------------------------------------------- */
if(btnsubmit){
    btnsubmit.addEventListener("click", e =>{
        let email = txtemail.value;
        let pass = txtpass.value;
        const auth = firebase.auth();

        //signin
        firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(){
            authChange();
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    });
}
/* --------------------------------------------------------------------------------
            Signout
---------------------------------------------------------------------------------------- */
if(btnsignout){
    btnsignout.addEventListener("click", e =>{
        const auth = firebase.auth();
        firebase.auth().signOut().then(function() {
            authChange();
        }).catch(function(error) {
            // An error happened.
        });
    });
}
/* --------------------------------------------------------------------------------
           Authentication
---------------------------------------------------------------------------------------- */
function authChange() {
    firebase.auth().onAuthStateChanged(user =>{
        if(user){
//            currentUserData();
            saveUserLocal(user);
            location.href = 'index.html';
        }else{
            deleteLocalUser();
            window.location ='login.html';
            console.log("User not signed in");   
        }
    });
    
} 
/* --------------------------------------------------------------------------------
            saving user to localstorage
---------------------------------------------------------------------------------------- */
function saveUserLocal(user) {
    let userLocal = {
        emailLocal: user.email,
        uid: user.uid
    }

    let users=[]
    users.push(userLocal);
    localStorage.setItem('users', JSON.stringify(users));
}
// delecting local user
function deleteLocalUser() {
    let users = JSON.parse(localStorage.getItem('users'));
    users.splice(0,1);
    localStorage.setItem('users', JSON.stringify(users));
}
/* --------------------------------------------------------------------------------
           Database
---------------------------------------------------------------------------------------- */

const ref = database.ref('userData');



/* -------------------------------------------------*/
/*
// get user data
function currentUserData() {
    let currUser = firebase.auth().currentUser;
    let currName, currEmail, currUid;

    if (currUser != null) {
        currName = currUser.displayName;
        currEmail = currUser.email;
        currUid = currUser.uid;
    }
    console.log(currEmail, currName,);
}

*/


// ---------------------------------------------------
if(bookForm){
    bookForm.addEventListener('submit', saveBookmark);
}
/* --------------------------------------------------------------------------------
            saving bookmarks
---------------------------------------------------------------------------------------- */
function saveBookmark(e) {
    let title = document.getElementById('title').value;
    let url = document.getElementById('url').value;
    let currUser = firebase.auth().currentUser;
    let uid = currUser.uid ;

    e.preventDefault();
/*
    let bookmark = {
        uid: currUser.uid,
        name: title,
        url: url
    }
 */    
    ref.child(uid).push({
        name: title,
        url: url
    });
 
  /*if(localStorage.getItem('bookmarks') === null){
        let bookmarks = [];
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }else{
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }*/
    document.getElementById('bookForm').reset();
    fetchBookmarks();
}


/* --------------------------------------------------------------------------------
            deleting bookmarks
---------------------------------------------------------------------------------------- */
function deleteBookmark(dataKey) {
    let currUser = firebase.auth().currentUser;
    let myUserId = currUser.uid;
    const dbRef = firebase.database().ref('userData/' + myUserId + '/' + dataKey);
    dbRef.on('value', snap => {
        snap.ref.remove();
    });
/*    
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    for (var index = 0; index < bookmarks.length; index++) {
        if (url === bookmarks[index].url) {
            bookmarks.splice(index, 1);
        }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
*/
    fetchBookmarks();
}
/* --------------------------------------------------------------------------------
            fetching bookmarks
---------------------------------------------------------------------------------------- */
function fetchBookmarks() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let myUserId = user.uid;
            var $load = $('<div class="loading">Loading...</div>').appendTo('body');
            const dbRef = firebase.database().ref('userData/' + myUserId);
            dbRef.on('value', snap => {
                $load.hide();
                bookmarkResult.innerHTML = ' ';
                snap.forEach(childSnap => {
                    let bookmarks = [] ;
                    bookmarks = childSnap.val();
                  //  console.log(bookmarks);
                    let name = bookmarks.name;
                    let url = bookmarks.url;
                    let dataKey = childSnap.key;
                 //   console.log(name, url);   
                    let template = `<div class="card" style="width: 20rem;">
                                        <img class="card-img-top">
                                        <div class="card-body">
                                            <h4 class="card-title">${name}</h4>
                                            <a href="${url}" target="_blank" class="btnCard"> Visit </a>
                                            <a onclick = "deleteBookmark('${dataKey}')" href="#" class="btnCard">Delete</a>
                                        </div>
                                    </div>`
                    bookmarkResult.innerHTML += template;  
                });
            });
                /*
                let bookmarkResult = document.getElementById('results');
                bookmarkResult.innerHTML = ' ';
                if(bookmarks != null){
        
                    snap.forEach(function (userSnap) {
                        let userSnapKey = userSnap.key;
                        console.log(userSnap.numChildren());
                        console.log(userSnap.key);
                            
                                userSnap.forEach( function(childSnap){
                                    
                                    if(userSnapKey == myUserId){
                                        let bookmarksChild = childSnap.val();
                                        let name = bookmarksChild.name;
                                        let url = bookmarksChild.url;
                                        console.log(name, url);   
                                        let template = `<div class="card" style="width: 20rem;">
                                                            <img class="card-img-top">
                                                            <div class="card-body">
                                                                <h4 class="card-title">${name}</h4>
                                                                <a href="${url}" target="_blank" class="btnCard"> Visit </a>
                                                                <a onclick = "deleteBookmark('${url}')" href="#" class="btnCard">Delete</a>
                                                            </div>
                                                        </div>`
                                        bookmarkResult.innerHTML += template;                           
                                    }
                                 });
                                
                            
                    
                 });
                    
            
                } */
            
        } else {
          console.log("not logged in");
        }
      });
    
    


    
    
    /*
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    let bookmarkResult = document.getElementById('results');
    bookmarkResult.innerHTML = ' ';
    if(bookmarks != null){
        for (let index = 0; index < bookmarks.length; index++) {
            let name = bookmarks[index].name;
            let url = bookmarks[index].url;   
            
            let template = `<div class="card" style="width: 20rem;">
                                <img class="card-img-top">
                                <div class="card-body">
                                    <h4 class="card-title">${name}</h4>
                                    <a href="${url}" target="_blank" class="btnCard"> Visit </a>
                                    <a onclick = "deleteBookmark('${url}')" href="#" class="btnCard">Delete</a>
                                </div>
                            </div>`
            bookmarkResult.innerHTML += template;
        }

    } */
}

