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
    SaveDataHeader.cityHeaders[currentSaveSlot].name = "";  //basic undo of save attempt, destroys previous save
    // Error pop-up for user...
  }
  
  updateMainMenuButtons();
}

function saveSlotDelete(i) {
  localStorage.removeItem("save_" + i);
}
