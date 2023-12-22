/* * * * * * * * * *
* Utility Functions *
* * * * * * * * * */

function validateDisplayDevice() {
  console.debug(`window.screen Size: (${window.screen.width},${window.screen.height})`);
  if (window.screen.width >= 1600 && window.screen.height >= 900) {
    $("#normal-game-screen").removeClass("not-displayed");
    return true;
  } else {
    $("#device-crash-screen").removeClass("not-displayed");
    console.error('Device not supported!');
    return false;
  }
}

async function validateLocalStorage() {
  if (localStorage) {
    try {
      const est = await navigator.storage.estimate();
      console.debug(`Maximum Local Storage: (~${Math.floor(est.quota / 1024 / 1024)} MB)`);
      console.debug(`Used Local Storage: (~${Math.floor(est.usage / 1024 / 1024)} MB)`);

      let per = await navigator.storage.persisted();
      console.group("Local Storage Persistence");
      if (!per) {
        console.info("Requesting Persistence.");
        per = await navigator.storage.persist();
        if (per) {
          console.info("Persistence Granted.");
          localStorageReliable = true;
        } else {
          console.info("Persistence Denied.");
        }
      } else {
        console.info("Local Storage is already made Persistent.");
        localStorageReliable = true;
      }
      console.groupEnd();
    } catch (e) {
      console.warn(e);
      console.warn("Saving games may not be reliable!");
    } finally {
      localStorageUsable = true;
    }
  }
}

// function useCustomDialogBoxEventHandling() {
//   // Preventing ESC from doing anything to modal boxes.
//   $("dialog").on("cancel close", function(e) {
//     e.preventDefault();
//   });
//   // Disable messy <dialog> + <form> default events, when some buttons clicked.
//   $("dialog button").on("click", function(e) {
//     e.preventDefault();
//   });
// }



/* * * * * *
* Game Data *
* * * * *  */

// Application:
let
  localStorageUsable = false,
  localStorageReliable = false;   // unused...
const
  saveCountMax = 5,
  saveSizeMax = 1000000;

// Game World:
let cityData = {
  name: undefined
};



/* * * * * * * *
* Gameplay Init *
* * * * * * * */

function startCity() {
  $("#welcome-splash-container").addClass("not-displayed");
  console.debug('{StartCity} Executing.');
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
  console.debug(`validDisplay: (${validDisplay})`);
  console.info('Gameplay can start!');

  ///  Check Browser Local Storage Stats
  ////////////////////////////////////////
  validateLocalStorage().then(() => {
    if (localStorageUsable) {
      console.info("Local Storage Ready!");

      $("#loadcity-button").on("click", function() {});   //is disabled for now...
    }
  });
  
  ///  Setup Custom Default Behaviour for Modal Dialogs
  ///////////////////////////////////////////////////////
  // useCustomDialogBoxEventHandling();

  ///  Setup UI Events Handlers.
  ////////////////////////////////

  // To Open the New City Dialog:
  $("#newcity-button").on("click", function() {
    $("#new-city-input-name")[0].value = "";
    $("#new-city-found").attr("disabled", "true");
    $("#new-city-dialog")[0].showModal();
  });

  // To Monitor the City Name Field for Empty String, and Disable the Found Button when Appropriate:
  $("#new-city-input-name").on("input", function(e) {
    e.target.value === "" ? $("#new-city-found").attr("disabled", "true") : $("#new-city-found").attr("disabled", null);
  });

  // Log ESC key:
  $("#new-city-dialog").on("cancel", function(e) {
    console.debug('ACTION: [Found New City] Cancelled (ESC).');
  });

  // Close the Dialog if Cancel button clicked:
  $("#new-city-cancel").on("click", function() {
    $("#new-city-dialog")[0].close();
    console.debug('ACTION: [Found New City] Cancelled (BTN).');
  });

  // Save the New City Data, and Start the Simulation:
  $("#new-city-dialog > form").on("submit", function(e) {
    console.info('ACTION: [Found New City] Submitted.');

    cityData.name = $("#new-city-input-name")[0].value;
    console.debug(`cityData.name: (${cityData.name})`);

    startCity();
  });
}
