/* * * * * * * * * *
* Utility Functions *
* * * * * * * * * */

function validateDisplayDevice() {
  console.log(`LOG window.screen SIZE: (${window.screen.width},${window.screen.height})`);
  if (window.screen.width >= 1600 && window.screen.height >= 900) {
    $("#normal-game-screen").removeClass("not-displayed");
    return true;
  } else {
    $("#device-crash-screen").removeClass("not-displayed");
    console.log('LOG ERROR: device not supported!');
    return false;
  }
}

function useCustomDialogBoxEventHandling() {
  // Preventing ESC from doing anything to modal boxes.
  $("dialog").on("cancel close", function(e) {
    e.preventDefault();
  });
  // Disable messy <dialog> + <form> default events, when some buttons clicked.
  $("dialog button").on("click", function(e) {
    e.preventDefault();
  });
}



/* * * * * *
* Game Data *
* * * * *  */

let cityData = {
  name: undefined
};



/* * * * * * * *
* Gameplay Init *
* * * * * * * */

function startCity() {
  $("#welcome-splash-container").addClass("not-displayed");
  console.log('LOG STATUS: {StartCity} Executing.');
}



/* * * * * * *
* System Init *
* * * * * * */

///  Check display resolution.
////////////////////////////////
const validDisplay = validateDisplayDevice();

///  Initialize.
//////////////////
if (validDisplay) {
  console.log(`LOG validDisplay: (${validDisplay})`);
  console.log('LOG STATUS: gameplay can start.');

  ///  Setup Custom Default Behaviour for Modal Dialogs
  ///////////////////////////////////////////////////////
  useCustomDialogBoxEventHandling();

  ///  Setup UI Events Handlers.
  ////////////////////////////////

  // To Open the New City Dialog:
  $("#newcity-button").on("click", function() {
    document.querySelector("#new-city-input-name").value = "";
    $("#new-city-found").attr("disabled", "true");
    document.querySelector("#new-city-dialog").showModal();
  });

  // To Monitor the City Name Field for Empty String, and Disable the Found Button when Appropriate:
  $("#new-city-input-name").on("input", function(e) {
    e.target.value === "" ? $("#new-city-found").attr("disabled", "true") : $("#new-city-found").attr("disabled", null);
  });

  // Return the City Name on Form Submit & Dialog Close:
  $("#new-city-found").on("click", function() {
    document.querySelector("#new-city-dialog").close(document.querySelector("#new-city-input-name").value);
  });

  // Return "" if cancelled new city:
  $("#new-city-cancel").on("click", function() {
    document.querySelector("#new-city-dialog").close("");
  });

  // Save the New City Data, and Start the Simulation:
  $("#new-city-dialog").on("close", function() {
    let cn = document.querySelector("#new-city-dialog").returnValue;
    if (cn !== "") {
      console.log('LOG ACTION: [Found New City] Submitted.');
      cityData.name = cn;
      console.log(`LOG cityData.name: (${cityData.name})`);
    } else {
      console.log('LOG ACTION: [Found New City] Cancelled.');
    }

    if (cn !== "") {
      startCity();
    }
  });

  $("#loadcity-button").on("click", function() {});   //is disabled for now...
}
