function validateDisplayDevice() {
  console.log(`LOG window.screen SIZE: (${window.screen.width},${window.screen.height})`);
  if (window.screen.width >= 1600 && window.screen.height >= 900) {
    $("#normal-game-screen").removeClass("not-displayed");
    return true;
  } else {
    $("#device-not-supported").removeClass("not-displayed");
    console.log('LOG ERROR: device not supported!');
    return false;
  }
}


/* * * * * * *
* Game Init *
* * * * * * */ 

// Check display resolution.
const validDisplay = validateDisplayDevice();

if (validDisplay) {
  console.log(`LOG validDisplay: (${validDisplay})`);
  console.log('LOG STATUS: gameplay can start.');
  //todo game session start...
  
}
