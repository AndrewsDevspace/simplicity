/* * * * * * * *
* Save File IO *
* * * * * * * */

function saveReadHeader() {
  SaveDataHeader.cityHeaders = JSON.parse(localStorage.getItem("cities") || '[]');
}

function saveWriteHeader() {
  localStorage.setItem("cities", JSON.stringify(SaveDataHeader.cityHeaders));
}

function saveRead() {
  if (currentSaveSlot >= SaveDataHeader.cityHeaders.length) {
    throw new Error("Trying to load from non-existent Save Slot!");
  } else {
    cityData = JSON.parse(localStorage.getItem("save_" + currentSaveSlot));
    if (cityData.credits === undefined) {
      cityData.credits = 100;
    }
    if (cityData.date === undefined) {
      cityData.date = {
        year: 2000,
        month: 1,
        day: 1
      };
    }
  }
}

function saveWrite() {
  if (currentSaveSlot == SaveDataHeader.cityHeaders.length) {
    SaveDataHeader.cityHeaders.push({ name: cityData.name });
  } else {
    SaveDataHeader.cityHeaders[currentSaveSlot].name = cityData.name;
  }

  try {
    saveWriteHeader();
    localStorage.setItem("save_" + currentSaveSlot, JSON.stringify(cityData));
  } catch (e) {
    console.error(e);
    //SaveDataHeader.cityHeaders[currentSaveSlot].name = "";  //basic undo of save attempt, destroys previous save
    // Error pop-up for user...
  }
  
  updateMainMenuButtons();
}

function saveSlotDelete(i) {
  SaveDataHeader.cityHeaders[i].name = "";
  localStorage.removeItem("save_" + i);
}
