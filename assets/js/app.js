let myData=null; // Declare myData variable globally
const myMain = document.getElementById('mainContent'); // Select the main element
let myState="firstrun"

initApp(); // Call the initApp function to initialize the app

function initApp(){
    // Initialize the app
 console.log("App initialized");
    // connect interface
  ConnectInterface()

    // Add any other initialization code here
    BuildLoader();

  

    myData=ReadData();


    if(myData==null){
        // If no data is found, create an empty array
        myData={
            lists:[],
            Profile:{
                name:"test"
            }
        };
        // Save the empty array to local storage
        SaveData(myData);
        // Build the loader
        myState="firstrun"
        setTimeout(function(){BuildProfileView()},3000);
       
    }else{
        // If data is found, continue with the data
       
       BuildLanding()
    }
}

function ConnectInterface(){
    console.log("Interface connected");
    
    let myNewButton = document.getElementById('newButton'); // Select the new button
    let myDeleteButton = document.getElementById('deleteButton'); // Select the delete button
    let myHomeButton = document.getElementById('homeButton'); // Select the home button
    let myProfileButton = document.getElementById('profileButton'); // Select the profile button

    let myInprogressButton = document.getElementById('inProgressButton'); // Select the inprogress button

    // connect event listeners

     myNewButton.addEventListener('click', function() {
       
        FooterCallback("new")
       
    }
    );

      
    myDeleteButton.addEventListener('click', function() {
       
        FooterCallback("delete")
       
    }   
    );
    myHomeButton.addEventListener('click', function() {
        FooterCallback("home");
    }
    );
    myProfileButton.addEventListener('click', function() {
        // Add code to handle profile button click
        FooterCallback("profile")
     
    }
    );

    myInprogressButton.addEventListener('click', function() {
        console.log("Inprogress button clicked");
        // Add code to handle inprogress button click
    }
    );
}

function BuildLanding(){
    ClearMain(); // Remove the loader before building the landing page
    myState="listview"
    // Build the header
    console.log(myData);

   let myName=myData.Profile.name; // Get the name from the profile data
   let myProfileNameField=document.getElementById('nameField'); // Select the header element
    myProfileNameField.innerText=`Hej ${myName}` // Set the header content to the name

    let myTodos=myData.lists; // Get the todos from the data

    if(myTodos.length==0){
        // If no todos are found, build the empty state
        myMain.innerHTML=`<div class="emptyState"><h2>Ingen todo lists</h2><p>Du har ingen todo lister endnu. Klik på knappen for at tilføje en ny liste.</p></div>`; // Add the empty state to the main content
    }else{
        // If todos are found, build the main content
        myTodos.forEach((list,index) => {
            myMain.innerHTML+=`<div class="todoList" onclick="ListViewCallBack(${index})"><h2>${list.name}</h2><p>${list.description}</p></div>`; // Add the todos to the main content
        });
    }
 

     console.log("Main content built");
     // Add any other main content building code here
    
   

}

function BuildProfileView(){
    // Build the profile view
    console.log("Profile view built");
    ClearMain();
    if (myState=="firstrun") {
         myMain.innerHTML=`<section class="profileView"><h2>Profil</h2><p>Her kan du ændre dine oplysninger.</p> <label for="nameInput">dit navn:</label>
    <input type="text" id="profileNameInput" name="nameInput" placeholder="indtast navn"><button onclick="ProfileCallBack('ok')">ok</button></section>`;   
    } else {
        myMain.innerHTML=`<section class="profileView"><h2>Profil</h2><p>Her kan du ændre dine oplysninger.</p> <label for="nameInput">dit navn:</label>
        <input type="text" id="profileNameInput" name="nameInput" placeholder="indtast navn"><button onclick="ProfileCallBack('ok')">ok</button><button onclick="ProfileCallBack('cancel')">cancel</button></section>`;
        
    }
 // Add the profile view to the main content
}

function FooterCallback(myAnswer){
    // Handle footer button clicks
    console.log("Footer callback: " + myAnswer);
    if (myAnswer=="new") {
      
       
    } else if (myAnswer=="delete") {
        console.log("Delete button clicked");
        // Add code to handle delete button click
    } else if (myAnswer=="home") {
        BuildLanding()
    } else if (myAnswer=="profile") {
        BuildProfileView()
    } else {
        console.log("Unknown footer button clicked");
    }
}

function ProfileCallBack(myAnswer){
    if (myAnswer=="ok") {
        myData.Profile.name=document.getElementById('profileNameInput').value
        // Save the empty array to local storage
        SaveData(myData);

        BuildLanding()
    } else {
        BuildLanding()
    }

}


function BuildListView(){
    // Build the footer
    console.log("Footer built");
    // Add any other footer building code here
}

function getData(){
    // Get data from localstorage

}


// service functions
function BuildLoader(){
    // Build the loader
    console.log("Loader built");
    // Add any other loader building code here
}  

function ClearMain(){
    // Remove the loader
    console.log("Loader removed");
    // Add any other loader removal code here
    myMain.innerHTML = ""; // Clear the main content
    myMain.classList.remove('loader'); // Remove the loader class from the main element
}


// Model kode. gemmer data tilsendt i local storage
function SaveData(toDoData) {
    let mySerializedData = JSON.stringify(toDoData)//konverterer modtaget data til string
    localStorage.setItem('savedData', mySerializedData)// gemmer i localStorage
}


// læser data fra local storage og konverterer det til array og objekter
function ReadData() {
    // læser data i local storage
    let myfoundData = localStorage.getItem('savedData')
    return JSON.parse(myfoundData) // konverterer det læste data til array og objekter og sender det tilbage til hvor funktionen er kaldt
}


