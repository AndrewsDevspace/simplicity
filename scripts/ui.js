/* * * * * * * * * * * * *
* User Interface Helpers *
* * * * * * * * * * * * */

function updateMainMenuButtons() {
  if (localStorageUsable && SaveDataHeader.usedSaveSlots() > 0) {
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

function enterCityView() {
  $("#welcome-splash-container").addClass("not-displayed");
  console.debug('{StartCity} Executing.');

  $("#gamearea-cityview").removeClass("not-displayed");
  $("#cityname-label").text(cityData.name);
}

function leaveCityView() {
  $("#gamearea-cityview").addClass("not-displayed");
  $("#welcome-splash-container").removeClass("not-displayed");
}

