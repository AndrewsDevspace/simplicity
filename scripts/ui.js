/* * * * * * * * * * * * *
* User Interface Helpers *
* * * * * * * * * * * * */

function removeFocus(element) {
  element.blur();
}

function updateMainMenuButtons() {
  if (localStorageUsable && SaveDataHeader.usedSaveSlots() > 0) {
    $("#welcome-menu-button-load").attr("disabled", null);
  } else {
    $("#welcome-menu-button-load").attr("disabled", "true");
  }

  if (SaveDataHeader.usedSaveSlots() < 5) {
    $("#welcome-menu-button-new").attr("disabled", null);
  } else {
    $("#welcome-menu-button-new").attr("disabled", "true");
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

function resetToolBoxes() {
  // "Click" opened tool descriptions:
  $(".toggled.tool-desc-opener-btn").trigger("click");
  // "Click" the toolbox menu buttons off:
  $("#planning-root-button").removeClass("toggled");
  $("#stats-root-button").removeClass("toggled");
  // Hide actual toolboxes:
  $(".common-menu-container").addClass("not-displayed");
}

function updateCreditBalanceLabel() {
  let label = $("#ui-label-creditbalance");
  let credits = cityData.credits;

  //Format number: group 3 digits by ' '...
  if (credits < 0) {
    label.text("$ " + Math.abs(credits));
    label.addClass("in-debt");
  } else {
    label.text("$ " + credits);
    label.removeClass("in-debt");
  }
}

function updateCashflowLabel() {
  //...
}

function updateRciGraph() {
  //...
}

function updateGameDateLabel() {
  let date = cityData.date;
  $("#gamedate-label").text(`${date.year}. ${date.month}. ${date.day}.`);
}

function enterCityView() {
  $("#normal-splash-welcome-container").addClass("not-displayed");
  console.debug('{StartCity} Executing.');

  $("#ui-top-label-cityname").text(cityData.name);
  resetToolBoxes();
  updateCreditBalanceLabel();
  updateGameDateLabel();
  $("#normal-gamearea-container").removeClass("not-displayed");
}

function leaveCityView() {
  $("#normal-gamearea-container").addClass("not-displayed");
  $("#normal-splash-welcome-container").removeClass("not-displayed");
}

