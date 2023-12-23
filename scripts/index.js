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

function saveReadHeader() {
  SaveDataHeader.cityHeaders = JSON.parse(localStorage.getItem("cities") || '[]');
}

function saveRead() {
  if (currentSaveSlot >= SaveDataHeader.cityHeaders.length) {
    throw new Error("Trying to load from non-existent Save Slot!");
  } else {
    cityData = JSON.parse(localStorage.getItem("save_" + currentSaveSlot));
  }
}

function saveWrite() {
  if (currentSaveSlot == SaveDataHeader.cityHeaders.length) {
    SaveDataHeader.cityHeaders.push({ name: cityData.name });
  } else {
    SaveDataHeader.cityHeaders[currentSaveSlot].name = cityData.name;
  }

  try {
    localStorage.setItem("cities", JSON.stringify(SaveDataHeader.cityHeaders));
    localStorage.setItem("save_" + currentSaveSlot, JSON.stringify(cityData));
  } catch (e) {
    console.error(e);
    SaveDataHeader.cityHeaders[currentSaveSlot].name = "";  //basic undo of save attempt, destroys previous save
    // Error pop-up for user...
  }
  
  updateMainMenuButtons();
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

function updateMainMenuButtons() {
  if (SaveDataHeader.usedSaveSlots() > 0) {
    $("#loadcity-button").attr("disabled", null);
  } else {
    $("#loadcity-button").attr("disabled", "true");
  }

  if (SaveDataHeader.usedSaveSlots() < 5) {
    $("#newcity-button").attr("disabled", null);
  } else {
    $("#newcity-button").attr("disabled", "true");
  }
}

function updateLoadDialogButtonsEnabled(bool) {
  if (bool) {
    $("#load-city-submit").attr("disabled", null);
    $("#load-city-delete").attr("disabled", null);
  } else {
    $("#load-city-submit").attr("disabled", "true");
    $("#load-city-delete").attr("disabled", "true");
  }
}



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

let SaveDataHeader = {
  cityHeaders: undefined,
  usedSaveSlots: function() {
    if (this.cityHeaders && this.cityHeaders.length != undefined) {
      let count = 0;
      this.cityHeaders.forEach(item => {
        if (item.name.length != undefined && item.name.length > 0) {
          ++count;
        }
      });
      return count;
    } else {
      return 0;
    }
  },
  firstEmptySlot: function() {
    if (this.cityHeaders && this.cityHeaders.length != undefined) {
      let i = this.cityHeaders.findIndex(item => 
        item.name != undefined && item.name === ""
      );
      if (i == -1) {
        if (this.cityHeaders.length < saveCountMax) {
          return this.cityHeaders.length;
        } else {
          return i;
        }
      } else {
        return i;
      }
    } else {
      return 0;
    }
  }
};

let currentSaveSlot = undefined;

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

  $("#gameplay-test-surface").removeClass("not-displayed");
  $("#gameplay-test-surface > p").text('Test City: "' + cityData.name + '"');
}

function leaveCity() {
  $("#gameplay-test-surface").addClass("not-displayed");
  $("#welcome-splash-container").removeClass("not-displayed");
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
      saveReadHeader();
    } else {
      console.warn("Local Storage Unusable!");
      SaveDataHeader.cityHeaders = [];
    }
    updateMainMenuButtons();
  });
  
  ///  Setup Custom Default Behaviour for Modal Dialogs
  ///////////////////////////////////////////////////////
  // useCustomDialogBoxEventHandling();

  ///  Setup UI Events Handlers.
  ////////////////////////////////

  // Open the New City Dialog:
  $("#newcity-button").on("click", function() {
    $("#new-city-input-name")[0].value = "";
    $("#new-city-found").attr("disabled", "true");
    $("#new-city-dialog")[0].showModal();
  });

  // Open the Load City Dialog:
  $("#loadcity-button").on("click", function() {
    // Fill up radio-labels with names...
    let radios = $('#load-city-dialog input[name="slot"]');
    let labels = $('#load-city-dialog input[name="slot"] + label');
    for (let i = 0; i < labels.length; i++) {
      let ls;
      if (i < SaveDataHeader.cityHeaders.length) {
        ls = SaveDataHeader.cityHeaders[i].name;
      } else {
        ls = "";
      }
      
      radios[i].checked = false;
      if (ls == "") {
        radios[i].setAttribute("disabled", "");
        labels[i].setAttribute("disabled", "");
        labels[i].innerHTML = "EMPTY SLOT";
      } else {
        radios[i].removeAttribute("disabled");
        labels[i].removeAttribute("disabled");
        labels[i].textContent = ls;
      }
    }

    updateLoadDialogButtonsEnabled(false);
    $("#load-city-dialog")[0].showModal();
  });

  // Show Save City Dialog:
  $("#menu-btn").on("click", function() {
    if (!localStorageUsable) {
      $("#save-city-save").attr("disabled", "true");
    } else {
      $("#save-city-save").attr("disabled", null);
    }
    $("#save-city-dialog")[0].showModal();
  });

  // To Monitor the City Name Field for Empty String, and Disable the Found Button when Appropriate:
  $("#new-city-input-name").on("input", function(e) {
    e.target.value === "" ? $("#new-city-found").attr("disabled", "true") : $("#new-city-found").attr("disabled", null);
  });
  // Enable Load City only once a Slot radio button is checked:
  $('#load-city-dialog input[name="slot"]').on("change", function(e) {
    updateLoadDialogButtonsEnabled(true);
  });

  // Log ESC key:
  $("#new-city-dialog").on("cancel", function(e) {
    console.debug('ACTION: [Found New City] Cancelled (ESC).');
  });
  $("#load-city-dialog").on("cancel", function(e) {
    console.debug('ACTION: [Load Old City] Cancelled (ESC).');
  });
  $("#save-city-dialog").on("cancel", function(e) {
    console.debug('ACTION: [Save Active City] Cancelled (ESC).');
  });

  // Close the Dialog if Cancel button clicked:
  $("#new-city-cancel").on("click", function() {
    $("#new-city-dialog")[0].close();
    console.debug('ACTION: [Found New City] Cancelled (BTN).');
  });
  $("#load-city-cancel").on("click", function() {
    $("#load-city-dialog")[0].close();
    console.debug('ACTION: [Load Old City] Cancelled (BTN).');
  });
  $("#save-city-cancel").on("click", function() {
    $("#save-city-dialog")[0].close();
    console.debug('ACTION: [Save Active City] Cancelled (BTN).');
  });

  // Deleting save file:
  $("#load-city-delete").on("click", function() {
    let deleting = $('#load-city-dialog input[name="slot"]:checked')[0];
    updateLoadDialogButtonsEnabled(false);
    
    let i = deleting.value;
    deleting.checked = false;
    deleting.setAttribute("disabled", "true");
    $('#load-city-dialog label[for="s' + i + '"]')[0].innerHTML = "EMPTY SLOT";

    SaveDataHeader.cityHeaders[i].name = "";
    localStorage.removeItem("save_" + i);
    localStorage.setItem("cities", JSON.stringify(SaveDataHeader.cityHeaders));

    updateMainMenuButtons();
  });

  // Set up the New City Data, and Start the Simulation:
  $("#new-city-dialog > form").on("submit", function(e) {
    console.info('ACTION: [Found New City] Submitted.');

    currentSaveSlot = SaveDataHeader.firstEmptySlot();
    if (currentSaveSlot == -1) {
      throw new Error("Trying to start new city, but no empty save slots left!");
    }

    cityData.name = $("#new-city-input-name")[0].value;
    console.debug(`cityData.name: (${cityData.name})`);

    startCity();
  });

  // Load old city data, start the simulation:
  $("#load-city-dialog > form").on("submit", function(e) {
    console.info('ACTION: [Load Old City] Submitted.');
    currentSaveSlot = $('#load-city-dialog input[name="slot"]:checked')[0].value;
    saveRead();
    startCity();
  });

  // Handle Save & Quit @ Save City Dialog:
  $("#save-city-save").on("click", function() {
    $("#save-city-dialog")[0].close();
    // Save the game-state:
    saveWrite();
    leaveCity();
  });

  // Handle Quit Only @ Save City Dialog:
  $("#save-city-quit").on("click", function() {
    $("#save-city-dialog")[0].close();
    leaveCity();
  });
}
