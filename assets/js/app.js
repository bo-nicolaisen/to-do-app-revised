let myData=null; // Declare myData variable globally
const myMain = document.getElementById('mainContent'); // Select the main element

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
        setTimeout(function(){ BuildLanding()},3000);
       
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
        console.log("New button clicked");
        // Add code to handle new button click
    }
    );

      
    myDeleteButton.addEventListener('click', function() {
        console.log("Delete button clicked");
        // Add code to handle delete button click
    }   
    );
    myHomeButton.addEventListener('click', function() {
        console.log("Home button clicked");
        // Add code to handle home button click
    }
    );
    myProfileButton.addEventListener('click', function() {
        console.log("Profile button clicked");
        // Add code to handle profile button click
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
    myMain.innerHTML=`<div class="profileView"><h2>Profil</h2><p>Her kan du ændre dine oplysninger.</p></div>`; // Add the profile view to the main content
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


