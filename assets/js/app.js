let myData=null; // Declare myData variable globally
const myMain = document.getElementById('mainContent'); // Select the main element
let myState="firstrun"
let currentList=0; // Declare currentList variable globally

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

   buildListView(myTodos); // Build the list view with the todos
 

     console.log("Main content built");
     // Add any other main content building code here
    
   

}

function buildListView(myTodos){
    if(myTodos.length==0){
        // If no todos are found, build the empty state
        myMain.innerHTML=`<div class="emptyState"><h2>Ingen todo lists</h2><p>Du har ingen todo lister endnu. Klik på knappen for at tilføje en ny liste.</p></div>`; // Add the empty state to the main content
    }else{
        // If todos are found, build the main content
        myTodos.forEach((list,index) => {

           

            let myListElement=document.createElement('div'); // Create a new div element for the list
            myListElement.classList.add('todoListItem'); // Add the todoListItem class to the div element
            myListElement.innerHTML=`<h3>${list.name}</h3><p>${list.description}</p>${ ProgressSVG(list.state)}</div>`; // Set the inner HTML of the div element to the list name and description
            myListElement.addEventListener('click', function() {
                ListViewCallBack(index); // Call the ListViewCallBack function with the index of the list
            });
            let myDeleteButton=document.createElement('button'); // Create a new button element for the delete button
            myDeleteButton.classList.add('deleteButton'); // Add the deleteButton class to the button element
            myDeleteButton.innerHTML=`<img src="assets/img/delete.svg" alt="delete">`; // Set the inner HTML of the button element to the delete icon
            myDeleteButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Stop the click event from propagating to the parent element
                buildDeleteListOverlay(event,index); // Call the buildDeleteListOverlay function with the index of the list
            });
            myListElement.appendChild(myDeleteButton); // Append the delete button to the list element

            myMain.appendChild(myListElement); // Append the div element to the main content

            
        });
    }
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

function ListViewCallBack(myListIndex){
    // Handle list view callback    
    console.log("List view callback: " + myListIndex);
    currentList=myListIndex; // Set the current list index
    BuildItemView(myListIndex); // Build the item view for the selected list
}

function FooterCallback(myAnswer){
    // Handle footer button clicks
    console.log("Footer callback: " + myAnswer);
    if (myAnswer=="new") {
        BuildnewOverlay()
       
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


function BuildItemView(index){
    // Build the footer
    ClearMain(); 
    myState="itemView"
    console.log("build item view: " + index);
    myData.lists[currentList].items.forEach((item,index) => {
        myMain.innerHTML+=`<div class="todoListItem"><h3>${item.name}</h3><p>${item.description}</p><button onclick="buildItemDeleteOverlay(${index})">delete</button></div>`; // Add the todos to the main content
    }); // Add the todos to the main content 
    // Add any other footer building code here
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

function BuildnewOverlay(){

console.log("newOverlay built");
console.log(myState);

    ClearMain();
    switch (myState) {
        case "itemView":
            myMain.innerHTML=`<section class="newItemView"><h2>ny toDo</h2><p>giv dit item lidt liv.</p> <label for="nameInput">navn:</label>
            <input type="text" id="itemName" name="nameInput" placeholder="indtast beskrivelse"><label for="descriptionInput">navn:</label>
            <input type="text" id="itemDescriptionInput" name="nameInput" placeholder="beskrivelse"><button onclick="newItem('ok')">ok</button><button class="cancelButton" onclick="BuildItemView(${currentList})">cancel</button></section>`;
            break;
            case "listview":
                myMain.innerHTML=`<section class="newListView"><h2>ny liste</h2><p>giv din liste liv.</p> <label for="nameInput">navn:</label>
            <input type="text" id="listName" name="nameInput" placeholder="indtast navn"><label for="descriptionInput">navn:</label>
            <input type="text" id="listDescriptionInput" name="description" placeholder="beskrivelse"><button onclick="newList()">ok</button><button class="cancelButton" onclick="BuildLanding()">cancel</button></section>`;
            break;
      
        default:
            break;
      }

   
  
 // Add the profile view to the main content
}

function newList(){

    // get data
    let myName=document.getElementById('listName').value // Get the name from the input field
    let myDescription=document.getElementById('listDescriptionInput').value // Get the description from the input field

    let teststate=  Math.floor(Math.random() * (100 - 20 + 1) + 20);
    myData.lists.push({name:myName,description:myDescription,items:[],state:teststate}) // Add a new list to the data
    SaveData(myData); // Save the data to local storage
    BuildLanding(); // Build the landing page again
}

function buildDeleteListOverlay(event,index){
console.log(event);

    // Build the delete overlay 
    console.log("Delete overlay built");
    myMain.innerHTML=`<section class="deleteListView"><h2>Er du sikker på at du vil slette denne liste?</h2><p>${myData.lists[index].name}</p><button onclick="deleteList(${index})">Ja</button><button class="cancelButton" onclick="BuildLanding()">Nej</button></section>`; // Add the delete overlay to the main content
}

function deleteList(index){
    myData.lists.splice(index,1); // Remove the list from the data using splice
    SaveData(myData); // Save the data to local storage
    BuildLanding(); // Build the landing page again
}


// items code -------------------------------------------------------------------------------
function newItem(myAnsver){
    // get data
    let myName=document.getElementById('itemName').value // Get the name from the input field
    let myDescription=document.getElementById('itemDescriptionInput').value // Get the description from the input field
    
    // error checking
    if (myName.length==0) {
        alert("Du skal indtaste et navn") // Show an alert if the name is empty
        return; // Exit the function
    } else if (myDescription.length==0) {
        alert("Du skal indtaste en beskrivelse") // Show an alert if the description is empty
        return; // Exit the function
    } else if (myAnsver=="cancel") {
        BuildItemView(currentList) // Build the item view again if the user cancels
        return; // Exit the function
    } else if (myAnsver=="ok") {

    myData.lists[currentList].items.push({name:myName,description:myDescription,state:0}) // Add a new item to the first list in the data
    SaveData(myData); // Save the data to local storage
    BuildItemView() // Add a new item to the first list in the data
     // Build the landing page again
}

}

function buildItemDeleteOverlay(index){
    // Build the delete overlay
    console.log("Delete overlay built");
    myMain.innerHTML=`<section class="deleteItemView"><h2>Er du sikker på at du vil slette dette item?</h2><p>${myData.lists[currentList].items[index].name}</p><button onclick="deleteItemCallback(true,${index})">Ja</button><button class="cancelButton" onclick="deleteItemCallback(false,${index})">Nej</button></section>`; // Add the delete overlay to the main content
}

function deleteItemCallback(myDeleteAction,index){
    if(myDeleteAction){
    // Handle delete item callback
    console.log("Delete item callback: " + index);
    // Add code to handle delete item callback
    myData.lists[currentList].items.splice(index,1); // Remove the item from the list using splice
SaveData(myData); // Save the data to local storage
 // Build the item view again

    console.log("Item deleted: " + index);
    }else{
        console.log("Item delete cancelled: " + index);
    }
    BuildItemView(currentList);
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


function ProgressSVG(percentage){
let myPercentage=100.0-percentage; // Calculate the percentage to be displayed
    let base=565.48*0.01
let offset=myPercentage*base; // Initialize offset variable

let mySvg=`<svg width="100" height="100" viewBox="-25 -25 250 250" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg)">
    <circle r="90" cx="100" cy="100" fill="transparent" stroke="#e0e0e0" stroke-width="16px"></circle>
    <circle r="90" cx="100" cy="100" stroke="#76e5b1" stroke-width="16px" stroke-linecap="round" stroke-dashoffset="${offset}px" fill="transparent" stroke-dasharray="565.48px"></circle>
    <text x="73px" y="117px" fill="#6bdba7" font-size="52px" font-weight="bold" style="transform:rotate(90deg) translate(0px, -196px)">${percentage}</text>
  </svg>`;
return mySvg;
}


