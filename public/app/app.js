var LISTS =[
    {
       name:"Recipes",
       desc:"Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!",
       serving:" 4 ",
       time:" 1 hr 24 mins" ,
        listItems:[
            {
                name: "Supreme Pizza",
                
                desc:"Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!",
                serving:" 4 ",
                time:" 1 hr 24 mins" ,
                ingredients:"apple",
                instructions:"toast "    
            } 
        ]
    }
];
var _db= " ";
var userExists = false;
var userFullName = " "; 
var _userProfileInfo={};


function addItem(listIndex){
    let newInstructions= $("#instructions").val();
    let newIngredients= $("#ingredients").val();

    let newItemObj ={
        instructions: newInstructions,
        ingredients: newIngredients,
    };
    _userProfileInfo.lists[listIndex].listItems.push(newItemObj);
    updatUserInfo(_userProfileInfo);
    loadListItems(listIndex);
    
 }
function deleteItem(idx){
    _userProfileInfo.lists.splice(idx,1);
    updatUserInfo(_userProfileInfo);
    loadLists();
}
function loadListItems(){
    let listString =`
    <section class="pizza">
      <div class="wrapper"> `;
    $.each(_userProfileInfo.lists, function(idx,list){
        listString +=   `<div ${idx} class="food">
        <div class="food-image">
          <div class="food-name">${list.name}</div>
        </div>
        <div class="food-desc">
          <div class="sub-title">Description:</div>
          <div class="full-desc">
           ${list.desc}
          </div>
          <div class="sb-title">Total Time :</div>
          <p>${list.time}</p>
          <div class="sub-title">Servings:</div>
          <p>${list.serving} servings</p>
        </div>
      </div>
      <div class="ingredients">
        <div class="sub-title">Ingredients</div>
        <ul>
          <li class="nonumber">1/4 batch pizza dough</li>
          <li class="nonumber">2 tablespoons Last-Minute Pizza Sauce</li>
          <li class="nonumber">10 slices pepperoni</li>
          <li class="nonumber">
            1 cup cooked and crumbled Italian sausage
          </li>
          <li class="nonumber">2 large mushrooms, sliced</li>
          <li class="nonumber">1/4 bell pepper, sliced</li>
          <li class="nonumber">1 tablespoon sliced black olives</li>
          <li class="nonumber">1 cup shredded mozzarella cheese</li>
        </ul>
      </div>
      <div class="instructions">
        <div class="sub-title">Ingredients</div>
        <ol>
          <li>
            Preheat the oven to 475°. Spray pizza pan with nonstick cooking
            or line a baking sheet with parchment paper.
          </li>
          <li>
            Flatten dough into a thin round and place on the pizza pan.
          </li>
          <li>Spread pizza sauce over the dough.</li>
          <li>Layer the toppings over the dough in the order listed .</li>
          <li>
            Bake for 8 to 10 minutes or until the crust is crisp and the
            cheese melted and lightly browned.
          </li>
        </ol>
      </div>`
    });
    listString += `<button class="btn" onclick="loadLists()">Back</button> `;
    $(".wrapper").html(" ");
    $(".wrapper").html(listString);
    
}
function loadLists(){
    let listString  =`  `;
    $.each (_userProfileInfo.lists, function(idx,list){
        listString += `<div id=${idx} class="recipe-event">
                <div class="top">
                  <div class="your-recipe">
                    <div class="recipe-image">
                    
                      <button class="btn view" onclick="loadListItems()">
                        View
                      </button>
                    </div>
                    <div class="recipe-info">
                      <div class="recipe-details">
                        <div class="recipe-title">${list.name} </div>
                        <div class="recipe-desc">
                        ${list.desc}
                        </div>
                        <div class="timer">
                          <div class="timer-image"></div>
                          <p>${list.time}</p>
                        </div>
                        <div class="servings">
                          <div class="servings-image"></div>
                          <p>${list.serving}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
        <div class="bottom">
            <button class="btn">Edit Recipe</button>
            <button onclick="deleteItem()"class="btn">Delete</button>
        </div>
    </div>`
    });
    listString += ` `;
    $(".recipe-list").html(listString);
  
}
function addMainList(){
    let newListName = $("#listName").val(); 
    let newDesc = $("#listDesc").val(); 
    let newTime = $("#listTime").val(); 
    let newServing = $("#listServing").val(); 
    let newListObj = {
       name: newListName,
       desc: newDesc,
       time: newTime,
       serving: newServing,
       listItems: [],
    };

    _userProfileInfo.lists.push(newListObj);
    updatUserInfo(_userProfileInfo);
    loadLists();
    $("#listName").val("");
    $("#desc").val("");
    $("#time").val("");
    $("#serving").val("");
 
    alert("new recipe added");
}


function updatUserInfo(userObj){
    let id = firebase.auth().currentUser.uid;
    _db.collection("Users").doc(id).update(userObj).then(()=>{
        console.log("updated doc");
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("update doc error "+ error);

    });
}
function changedRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    // console.log(hashTag +" " + pageID);

    //jquery GET goes thru pageID ex home folder then home file

    // goes into model
    // pass pageID
    if (pageID != ""){
        $.get(`pages/${pageID}/${pageID}.html`, function(data){
           // console.log("data: " + data );
            $("#app").html(data);          
           
        });
        
    }else {
        $.get(`pages/home/home.html`, function(data){
            // console.log("data: " + data );
            $("#app").html(data);
        });
    }
    
}

function initListeners(){
    $(".bars").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
        $(".heroMobile").toggleClass("active");
    })

    $(".links a").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
        
    })

    // when hash changes change route
    $(window).on("hashchange", changedRoute);

    changedRoute();

    
}
function initFirebase(){
    firebase.auth().onAuthStateChanged((user)=>{
        if (user){
            _db = firebase.firestore();
            console.log("auth changed: logged in");
            if(user.displayName){
                $(".name").html(user.displayName);
            }
            $("#your-recipes").show();
            $("#login").hide();
            $("#logout").show();
            userExists = true;
        }else{
            _db = " ";
            _userProfileInfo = {};
            console.log("auth changed: logged out");
            $("#your-recipes").hide();
            //change to hide!!!!!
            $("#logout").hide();
            $("#login").show();
            userExists =false;
            userFullName = " ";
        }
    })
}
function signOut(){
    firebase.auth().signOut().then(() =>{
        console.log("signed out");
        $(".name").val("");
    })
    .catch((error) => {
        console.log("error signing out");
    });
}
function login(){
    let email = $("#log-email").val();
    let pw = $("#log-pw").val();

    firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        alert("You have sucuessfully logged in!" );
        $("#log-email").val("");
        $("#log-pw").val("");

        if (user){
            $("#login").hide();
            $("#logout").show();
            console.log("log out button showing")
        }else{
            console.log("log out button showing")
        }
        

        _db.collection("Users").doc(user.uid).get().then((doc)=>{
            console.log(doc.data());
            _userProfileInfo = doc.data();
           
            console.log("login user info  ", _userProfileInfo)
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("log in error "+ error);
    
        });

    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("log in error "+ error);

    });
}
function createAccount(){ 
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let pw = $("#pw").val();
    let fullName = fName + ' ' + lName;
    let userObj = {
        firstName: fName,
        lastName : lName,
        email: email,
        lists: [],
    };
    console.log("create " + fName +  " First Name " + lName +" Last Name ");
    
    firebase.auth().createUserWithEmailAndPassword(email, pw)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        console.log("created");
        firebase.auth().currentUser.updateProfile({
            displayName: fullName,
        });

        _db.collection('Users').doc(user.uid).set(userObj).then((doc)=>{
            console.log("doc added");
            _userProfileInfo = userObj;
            console.log("create userInfo ", _userProfileInfo);
        }); 
      

        userFullName = fullName;
        $(".name").html(userFullName);

        $("#fName").val("");
        $("#lName").val("");
        $("#email").val("");
        $("#pw").val("");
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("create error " + errorMessage);
        
    });
}

$(document).ready(function (){
    try {
        let app = firebase.app();
        initFirebase();
        initListeners();
        
    }catch (error){
        console.log("error: " + error);
    }

})