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
  name: undefined,
  credits: undefined,
  date: {
    year: undefined,
    month: undefined,
    day: undefined
  }
};

function addCredits(value) {
  cityData.credits += value;
  updateCreditBalanceLabel();
}



/* * * * * * *
* System Init *
* * * * * * */

///  Initialize.
//////////////////
if (validateDisplayDevice()) {
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
  $("#welcome-menu-button-new").on("click", function() {
    $("#new-city-input-name")[0].value = "";
    $("#new-city-found").attr("disabled", "true");
    $("#dialog-new-city")[0].showModal();
  });

  // Open the Load City Dialog:
  $("#welcome-menu-button-load").on("click", function() {
    // Fill up radio-labels with names...
    let radios = $('#dialog-load-city input[name="slot"]');
    let labels = $('#dialog-load-city input[name="slot"] + label');
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
    $("#dialog-load-city")[0].showModal();
  });

  // Show Save City Dialog:
  $("#ui-top-button-menu").on("click", function() {
    if (!localStorageUsable) {
      $("#game-menu-save").attr("disabled", "true");
    } else {
      $("#game-menu-save").attr("disabled", null);
    }
    removeFocus($("#ui-top-button-menu")[0]);
    $("#dialog-game-menu")[0].showModal();
  });

  // To Monitor the City Name Field for Empty String & Existing Names, and Disable the Found Button when Appropriate:
  $("#new-city-input-name").on("input", function(e) {
    let cn = e.target.value;
    if (cn === "" || SaveDataHeader.cityHeaders.findIndex(item => item.name == cn) > -1) {
      $("#new-city-found").attr("disabled", "true");
    } else {
      $("#new-city-found").attr("disabled", null);
    }
  });
  // Enable Load City only once a Slot radio button is checked:
  $('#dialog-load-city input[name="slot"]').on("change", function(e) {
    updateLoadDialogButtonsEnabled(true);
  });

  // Log ESC key:
  $("#dialog-new-city").on("cancel", function(e) {
    console.debug('ACTION: [Found New City] Cancelled (ESC).');
  });
  $("#dialog-load-city").on("cancel", function(e) {
    console.debug('ACTION: [Load Old City] Cancelled (ESC).');
  });
  $("#dialog-game-menu").on("cancel", function(e) {
    console.debug('ACTION: [Save Active City] Cancelled (ESC).');
  });

  // Close the Dialog if Cancel button clicked:
  $("#new-city-cancel").on("click", function() {
    $("#dialog-new-city")[0].close();
    console.debug('ACTION: [Found New City] Cancelled (BTN).');
  });
  $("#load-city-cancel").on("click", function() {
    $("#dialog-load-city")[0].close();
    console.debug('ACTION: [Load Old City] Cancelled (BTN).');
  });
  $("#game-menu-cancel").on("click", function() {
    $("#dialog-game-menu")[0].close();
    console.debug('ACTION: [Save Active City] Cancelled (BTN).');
  });

  // Deleting save file:
  $("#load-city-delete").on("click", function() {
    let deleting = $('#dialog-load-city input[name="slot"]:checked')[0];
    updateLoadDialogButtonsEnabled(false);
    
    let i = deleting.value;
    deleting.checked = false;
    deleting.setAttribute("disabled", "true");
    $('#dialog-load-city label[for="s' + i + '"]')[0].innerHTML = "EMPTY SLOT";

    saveSlotDelete(i);
    saveWriteHeader();

    updateMainMenuButtons();
  });

  // Set up the New City Data, and Start the Simulation:
  $("#dialog-new-city > form").on("submit", function(e) {
    console.info('ACTION: [Found New City] Submitted.');

    currentSaveSlot = SaveDataHeader.firstEmptySlot();
    if (currentSaveSlot == -1) {
      throw new Error("Trying to start new city, but no empty save slots left!");
    }

    cityData.name = $("#new-city-input-name")[0].value;
    cityData.credits = 100;
    cityData.date = {
      year: 2000,
      month: 1,
      day: 1
    };
    
    enterCityView();
  });

  // Load old city data, start the simulation:
  $("#dialog-load-city > form").on("submit", function(e) {
    console.info('ACTION: [Load Old City] Submitted.');
    currentSaveSlot = $('#dialog-load-city input[name="slot"]:checked')[0].value;
    saveRead();
    enterCityView();
  });

  $('input[name="speed"]').on("click", function(e) {
    //... Set game speed...
    removeFocus(this);
  });

  $(".toolbox-toggler").on("click", function(e) {
    // Toggle the 'toggled' class:
    this.classList.toggle("toggled");
    removeFocus(this);
  });

  $("#stats-root-button").on("click", function(e) {
    // Show/Hide Detailed Stats Toolbox:
    $("#stats-root-button").hasClass("toggled") ?
      $("#stats-menu-container").removeClass("not-displayed") :
      $("#stats-menu-container").addClass("not-displayed");
  });

  $("#planning-root-button").on("click", function(e) {
    // Show/Hide City Builder (Planner) Toolbox:
    $("#planning-root-button").hasClass("toggled") ?
      $("#planning-menu-container").removeClass("not-displayed") :
      $("#planning-menu-container").addClass("not-displayed");
  });

  $(".tool-desc-opener-btn").on("click", function(e) {
    this.classList.contains("toggled") ?
      $("#" + this.dataset.toolId).removeClass("not-displayed") :
      $("#" + this.dataset.toolId).addClass("not-displayed");
  });

  // Handle Save & Quit @ Save City Dialog:
  $("#game-menu-save").on("click", function() {
    $("#dialog-game-menu")[0].close();
    // Save the game-state:
    saveWrite();
    leaveCityView();
  });

  // Handle Quit Only @ Save City Dialog:
  $("#game-menu-quit").on("click", function() {
    $("#dialog-game-menu")[0].close();
    leaveCityView();
  });
}
