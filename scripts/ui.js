/* * * * * * * * * * * * *
* User Interface Helpers *
* * * * * * * * * * * * */

function removeFocus(element) {
  element.blur();
}

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

function resetToolBoxes() {
  $(".toolbox-toggler").removeClass("toggled");
  // Hide actual toolboxes:
  $(".cityview-toolbox").addClass("not-displayed");
}

function updateCreditBalanceLabel() {
  let label = $("#creditbalance-label");
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
  $("#welcome-splash-container").addClass("not-displayed");
  console.debug('{StartCity} Executing.');

  $("#cityname-label").text(cityData.name);
  resetToolBoxes();
  updateCreditBalanceLabel();
  updateGameDateLabel();
  $("#gamearea-cityview").removeClass("not-displayed");
}

function leaveCityView() {
  $("#gamearea-cityview").addClass("not-displayed");
  $("#welcome-splash-container").removeClass("not-displayed");
}

