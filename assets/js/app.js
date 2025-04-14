let myData = null; // Declare myData variable globally
const myMain = document.getElementById("mainContent"); // Select the main element

 const completedColor=getComputedStyle(document.documentElement).getPropertyValue('--color-ok'); // Get the CSS variable for the completed color

let myState = "firstrun";
let currentList = 0; // Declare currentList variable globally
const globalDebug = false; // Set globalDebug to true for debugging purposes

initApp(); // Call the initApp function to initialize the app

function initApp() {
  // Initialize the app
  if (globalDebug) { console.log("App initialized"); }
  // connect interface
  ConnectInterface();

  // Add any other initialization code here
  BuildLoader();

  myData = ReadData();
  if (myData == null) {
    // If no data is found, create an empty array
    myData = {
      lists: [],
      Profile: {
        name: "test",
      },
    };
    // Save the empty array to local storage
    SaveData(myData);
    // Build the loader
    myState = "firstrun";
    setTimeout(function () {
      BuildProfileView();
    }, 3000);
  } else {
    // If data is found, continue with the data

    BuildLanding();
  }
}

function ConnectInterface() {
  if (globalDebug) { console.log("Interface connected"); }

  let myNewButton = document.getElementById("newButton"); // Select the new button
 // let myDeleteButton = document.getElementById("deleteButton"); // Select the delete button
  let myHomeButton = document.getElementById("homeButton"); // Select the home button
  let myProfileButton = document.getElementById("profileButton"); // Select the profile button

  let myInprogressButton = document.getElementById("inProgressButton"); // Select the inprogress button

  // connect event listeners

  myNewButton.addEventListener("click", function () {
    FooterCallback("new");
  });

 /*  myDeleteButton.addEventListener("click", function () {
    FooterCallback("delete");
  }); */
  myHomeButton.addEventListener("click", function () {
    FooterCallback("home");
  });
  myProfileButton.addEventListener("click", function () {
    // Add code to handle profile button click
    FooterCallback("profile");
  });

  myInprogressButton.addEventListener("click", function () {
    console.log("Inprogress button clicked");
    // Add code to handle inprogress button click
  });
}

function BuildLanding() {
  ClearMain(); // Remove the loader before building the landing page
  myState = "listview";
  if (globalDebug) { console.log(myData); }

  let myName = myData.Profile.name; // Get the name from the profile data
  let myProfileNameField = document.getElementById("nameField"); // Select the header element
  myProfileNameField.innerText = `Hej ${myName}`; // Set the header content to the name

  let myHeaderDescriptionElement = document.getElementById("headerDescription"); // Select the header element
  myHeaderDescriptionElement.innerText = `Her kan du se alle dine lister`;

  let myTodos = myData.lists; // Get the todos from the data

  buildListView(myTodos); // Build the list view with the todos

  if (globalDebug) { console.log("Main content built"); }
}

function buildListView(myTodos) {
  if (myTodos.length == 0) {
    // If no todos are found, build the empty state
    myMain.innerHTML = `<div class="emptyState"><h2>Ingen todo lists</h2><p>Du har ingen todo lister endnu. Klik på knappen for at tilføje en ny liste.</p></div>`; // Add the empty state to the main content
  } else {
    // If todos are found, build the main content
    myTodos.forEach((list, index) => {
      let myListElement = document.createElement("div"); // Create a new div element for the list
      myListElement.classList.add("todoListItem"); // Add the todoListItem class to the div element

      let myListDescriptionElement = document.createElement("section");

      myListDescriptionElement.innerHTML = `<h3>${list.name}</h3><p>${list.description}</p>`; // Set the inner HTML of the div element to the list name and description

      let myDeleteButton = document.createElement("img"); // Create a new button element for the delete button
      myDeleteButton.classList.add("deleteIcon"); // Add the deleteButton class to the button element
      myDeleteButton.src = "assets/img/delete.svg"; // Set the inner HTML of the button element to the delete icon
      myDeleteButton.addEventListener("click", function (event) {
        if (globalDebug) { console.log("Delete button clicked for list index: " + index); }
        event.stopPropagation(); // Stop the click event from propagating to the parent element
        buildDeleteListOverlay(event, index); // Call the buildDeleteListOverlay function with the index of the list
      });

      myListDescriptionElement.appendChild(myDeleteButton);

      let myProgressElement = document.createElement("section");
      myProgressElement.innerHTML = `${ProgressSVG(list.state)}`; // Set the inner HTML of the div element to the list name and description

      myListElement.appendChild(myListDescriptionElement);
      myListElement.appendChild(myProgressElement);

      myListElement.addEventListener("click", function () {
        ListViewCallBack(index); // Call the ListViewCallBack function with the index of the list
      });

      // Append the delete button to the list element

      myMain.appendChild(myListElement); // Append the div element to the main content
    });
  }
}

function BuildProfileView() {
  if (globalDebug) { console.log("Profile view built"); }
  ClearMain();
  if (myState == "firstrun") {
    myMain.innerHTML = `<section class="profileView"><h2>Profil</h2><p>Skriv dit navn for at fortsætte..</p> 
    <label for="profileNameInput">dit navn:</label> <!-- Fixed mismatch -->
    <input type="text" id="profileNameInput" name="nameInput" placeholder="indtast navn">
    <section id="profileButtons"><button onclick="ProfileCallBack('ok')">ok</button></section></section>`;
  } else {
    myMain.innerHTML = `<section class="profileView"><h2>Profil</h2><p>Her kan du ændre dine oplysninger.</p> 
    <label for="profileNameInput">dit navn:</label> <!-- Fixed mismatch -->
    <input type="text" id="profileNameInput" name="nameInput" placeholder="indtast navn">
    <section id="profileButtons"><button class="okButton" onclick="ProfileCallBack('ok')">ok</button>
    <button class="cancelButton" onclick="ProfileCallBack('cancel')">cancel</button></section></section>`;
  }
  // Add the profile view to the main content
}

function ListViewCallBack(myListIndex) {
  if (globalDebug) { console.log("List view callback: " + myListIndex); }
  currentList = myListIndex; // Set the current list index
  BuildItemView(myListIndex); // Build the item view for the selected list
}

function FooterCallback(myAnswer) {
  if (globalDebug) { console.log("Footer callback: " + myAnswer); }
  if (myAnswer == "new") {
    BuildnewOverlay();
  } else if (myAnswer == "delete") {
    console.log("Delete button clicked");
    // Add code to handle delete button click
  } else if (myAnswer == "home") {
    BuildLanding();
  } else if (myAnswer == "profile") {
    BuildProfileView();
  } else {
    console.log("Unknown footer button clicked");
  }
}

function ProfileCallBack(myAnswer) {
  if (globalDebug) { console.log("Profile callback: " + myAnswer); }
  if (myAnswer == "ok") {
    myData.Profile.name = document.getElementById("profileNameInput").value;
    // Save the empty array to local storage
    SaveData(myData);
  }

  if (myState=="listview") {
    BuildLanding();
  } else if(myState=="itemView") {
    BuildItemView(currentList)
  }
}


function BuildnewOverlay() {
  if (globalDebug) { console.log("newOverlay built"); }
  if (globalDebug) { console.log(myState); }

  ClearMain();
  switch (myState) {
    case "itemView":
      myMain.innerHTML = `<section class="newItemView"><h2>ny toDo</h2><p>giv dit item lidt liv.</p> 
      <label for="itemName">navn:</label> <!-- Fixed mismatch -->
      <input type="text" id="itemName" name="nameInput" placeholder="indtast beskrivelse">
      <label for="itemDescriptionInput">beskrivelse:</label> <!-- Fixed mismatch -->
      <input type="text" id="itemDescriptionInput" name="nameInput" placeholder="beskrivelse">
      <button class="okButton" onclick="newItem('ok')">ok</button>
      <button class="cancelButton" onclick="BuildItemView(${currentList})">cancel</button></section>`;
      break;
    case "listview":
      myMain.innerHTML = `<section class="newListView"><h2>ny liste</h2><p>giv din liste liv.</p> 
      <label for="listName">navn:</label> <!-- Fixed mismatch -->
      <input type="text" id="listName" name="nameInput" placeholder="indtast navn">
      <label for="listDescriptionInput">beskrivelse:</label> <!-- Fixed mismatch -->
      <input type="text" id="listDescriptionInput" name="description" placeholder="beskrivelse">
      <button class="okButton" onclick="newList()">ok</button>
      <button class="cancelButton" onclick="BuildLanding()">cancel</button></section>`;
      break;

    default:
      break;
  }

  // Add the profile view to the main content
}

function newList() {
  // get data
  let myName = document.getElementById("listName").value; // Get the name from the input field
  let myDescription = document.getElementById("listDescriptionInput").value; // Get the description from the input field

 
  myData.lists.push({
    name: myName,
    description: myDescription,
    items: [],
    state: 0,
  }); // Add a new list to the data
  SaveData(myData); // Save the data to local storage
  BuildLanding(); // Build the landing page again
}

function buildDeleteListOverlay(event, index) {
  if (globalDebug) { console.log(event); }

  if (globalDebug) { console.log("Delete overlay built"); }
  myMain.innerHTML = `<section class="deleteOverlay"><h4>Er du sikker på at du vil slette?</h4><h2>${myData.lists[index].name}</h2><button class="okButton" onclick="deleteList(${index})">Ja</button><button class="cancelButton" onclick="BuildLanding()">Nej</button></section>`; // Add the delete overlay to the main content
}

function deleteList(index) {
  if (globalDebug) { console.log("List deleted: " + index); }
  myData.lists.splice(index, 1); // Remove the list from the data using splice
  SaveData(myData); // Save the data to local storage
  BuildLanding(); // Build the landing page again
}

// items code -------------------------------------------------------------------------------

function BuildItemView(index) {
  ClearMain();
  myState = "itemView";

  myData.lists[currentList].items.forEach((item, index) => {
    // Create a new div element for the item
    let myItemElement = document.createElement("div"); // Create a new div element for the item
    myItemElement.classList.add("todoListItem"); // Add the todoListItem class to the div element
    myItemElement.innerHTML = `<h3>${item.name}</h3><p>${item.description}</p>`; // Set the inner HTML of the div element to the item name and description
    myItemElement.addEventListener("click", function () {
      buildItemEditView(index); // Call the buildItemEditView function with the index of the item
    }   ); // Add a click event listener to the item element

    // Create a new button element for the done button
    let myDoneButton = document.createElement("div"); // Create a new button element for the delete button
    //myDoneButton.classList.add('deleteIcon'); // Add the deleteButton class to the button element
    myDoneButton.innerHTML = `${doneIcon(item.state)}`; // Set the inner HTML of the button element to the delete icon
   
    // Set the inner HTML of the button element to the delete icon
    myDoneButton.addEventListener("click", function (event) {
      event.stopPropagation(); // Stop the click event from propagating to 
      
      toggleItem(index)
    });
    myItemElement.appendChild(myDoneButton);

    // Add the todos to the main content
    myMain.appendChild(myItemElement); // Append the div element to the main content
   
  }); 

}

function toggleItem(index){
  if (globalDebug) { console.log("toggleItem: " + myData.lists[currentList].items[index].state); }
   if (myData.lists[currentList].items[index].state == 0) {
    myData.lists[currentList].items[index].state = 1; // Set the state to 1 if it is currently 0    
   }else{
        myData.lists[currentList].items[index].state = 0; // Set the state to 0 if it is currently 1
    }

    myData.lists[currentList].state = calculatePercentDone(); // Calculate the percentage of done items
   SaveData(myData); // Save the data to local storage
   BuildItemView(currentList); // Build the item view again
   } 
function newItem(myAnsver) {
  // get data
  let myName = document.getElementById("itemName").value; // Get the name from the input field
  let myDescription = document.getElementById("itemDescriptionInput").value; // Get the description from the input field

  // error checking
  if (myName.length == 0) {
    alert("Du skal indtaste et navn"); // Show an alert if the name is empty
    return; // Exit the function
  } else if (myDescription.length == 0) {
    alert("Du skal indtaste en beskrivelse"); // Show an alert if the description is empty
    return; // Exit the function
  } else if (myAnsver == "cancel") {
    BuildItemView(currentList); // Build the item view again if the user cancels
    return; // Exit the function
  } else if (myAnsver == "ok") {
    myData.lists[currentList].items.push({
      name: myName,
      description: myDescription,
      state: 0,
    }); // Add a new item to the first list in the data
    myData.lists[currentList].state = calculatePercentDone(); // Calculate the percentage of done items
    SaveData(myData); // Save the data to local storage
    BuildItemView(); // Add a new item to the first list in the data
    // Build the landing page again
  }
}

function buildItemDeleteOverlay(index) {
  if (globalDebug) { console.log("Delete overlay built"); }
  myMain.innerHTML = `<section class="deleteOverlay"><h2>Er du sikker på at du vil slette dette item?</h2><p>${myData.lists[currentList].items[index].name}</p><button class="okButton" onclick="deleteItemCallback(true,${index})">Ja</button><button class="cancelButton" onclick="deleteItemCallback(false,${index})">Nej</button></section>`; // Add the delete overlay to the main content
}

function deleteItemCallback(myDeleteAction, index) {
  if (globalDebug) { console.log("Delete item callback: " + index); }
  if (myDeleteAction) {
    // Handle delete item callback
    console.log("Delete item callback: " + index);
    // Add code to handle delete item callback
    myData.lists[currentList].items.splice(index, 1); // Remove the item from the list using splice
    SaveData(myData); // Save the data to local storage
    // Build the item view again

    console.log("Item deleted: " + index);
  } else {
    console.log("Item delete cancelled: " + index);
  }
  BuildItemView(currentList);
}

function buildItemEditView(index) {
  if (globalDebug) { console.log("Item edit view built"); }
    ClearMain();
    let myItem=myData.lists[currentList].items[index]; // Get the item from the data using the index
    if (globalDebug) {console.log(myItem)};

    myState = "itemEditView";
    myMain.innerHTML = `<section class="itemEditView"><h2>Rediger item</h2>
    <label for="itemName">navn:</label> 
    <input type="text" id="itemName" name="nameInput"  value="${myItem.name}">    
    <label for="itemDescriptionInput">beskrivelse:</label> 
    <input type="text" id="itemDescriptionInput" name="descriptionInput" value="${myItem.description}"><button class="okButton" onclick="editItem(${index})">ok</button><button class="cancelButton" onclick="BuildItemView(${currentList})">cancel</button></section>`;
    // Add the item edit view to the main content
}

function editItem(index) {
  if (globalDebug) { console.log("Item edited: " + index); }
  let myName= document.getElementById("itemName").value; // Get the name from the input field
  let myDescription= document.getElementById("itemDescriptionInput").value; // Get the description from the input field

myData.lists[currentList].items[index].name=myName; // Set the name of the item to the new name
myData.lists[currentList].items[index].description=myDescription; // Set the description of the item to the new description
  SaveData(myData); // Save the data to local storage
  BuildItemView(currentList); // Build the item view again
}


// service functions --------------------------------------------------------------------------
function BuildLoader() {
  if (globalDebug) { console.log("Loader built"); }
  // Add any other loader building code here
}

function ClearMain() {
  if (globalDebug) { console.log("Loader removed"); }
  // Add any other loader removal code here
  myMain.innerHTML = ""; // Clear the main content
  myMain.classList.remove("loader"); // Remove the loader class from the main element
}

// Model kode. gemmer data tilsendt i local storage
function SaveData(toDoData) {
  let mySerializedData = JSON.stringify(toDoData); //konverterer modtaget data til string
  localStorage.setItem("savedData", mySerializedData); // gemmer i localStorage
}

// læser data fra local storage og konverterer det til array og objekter
function ReadData() {
  // læser data i local storage
  let myfoundData = localStorage.getItem("savedData");
  return JSON.parse(myfoundData); // konverterer det læste data til array og objekter og sender det tilbage til hvor funktionen er kaldt
}

// Progress SVG function to create a circular progress bar
// This function takes a percentage value and returns an SVG string representing the progress bar
function ProgressSVG(percentage) {
  let myPercentage = 100.0 - percentage; // Calculate the percentage to be displayed
  let base = 565.48 * 0.01; // Calculate the base value for the stroke-dasharray
  let offset = base * myPercentage; // Initialize offset variable
  let mySvg = `<svg width="100" height="100" viewBox="-25 -25 250 250" version="1.1" xmlns="http://www.w3.org/2000/svg"">
  <circle r="90" cx="50%" cy="50%" fill="transparent" stroke="#e0e0e0" stroke-width="16px"></circle>
  <circle r="90" cx="50%" cy="50%" stroke="${completedColor}" stroke-width="16px" stroke-linecap="round" stroke-dashoffset="${offset}px" fill="transparent" stroke-dasharray="565.48px" style="transform-box: fill-box; transform-origin: center; transform: rotate(-90deg);" ></circle>
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${completedColor}" font-size="52px" font-weight="bold">${percentage}%</text>

</svg>`;

  return mySvg;
}

function doneIcon(state) {
 
  if (state) {
    return `<svg width="64" height="64" viewBox="0 0 24 24"  fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="8" fill="#daebed" fill-opacity="1"></circle> <path d="M8.5 11L10.7929 13.2929C11.1834 13.6834 11.8166 13.6834 12.2071 13.2929L19.5 6" stroke="${completedColor}" stroke-width="2" stroke-linecap="round"></path> </g></svg>`;
  } else {
    return `<svg width="64" height="64" viewBox="0 0 24 24"  fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" stroke-width="1"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="8" fill="#daebed" fill-opacity="1"></circle> <path d="M8.5 11L10.7929 13.2929C11.1834 13.6834 11.8166 13.6834 12.2071 13.2929L19.5 6" stroke="#222222" stroke-width="1.2" stroke-linecap="round"></path> </g></svg>`;
  }
}

function calculatePercentDone(){
    let myList = myData.lists[currentList]; // Get the current list from the data
    let myItems = myList.items; // Get the items from the current list
    if(globalDebug){console.log(myItems)};
    
    let myDoneItems = myItems.filter((item) => item.state == 1); // Filter the items to get only the done items
    let myPercentDone = (myDoneItems.length / myItems.length) * 100; // Calculate the percentage of done items
    if (globalDebug) { console.log('percentage done: '+myPercentDone); }
    
    return Math.round(myPercentDone); // Return the rounded percentage value    
}
