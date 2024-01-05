/* * * * * * * * * *
* System Utilities *
* * * * * * * * * */

function validateDisplayDevice() {
  console.debug(`window.screen Size: (${window.screen.width},${window.screen.height})`);
  if (window.screen.width >= 1600 && window.screen.height >= 900) {
    $("#screen-normal").removeClass("not-displayed");
    return true;
  } else {
    $("#screen-crash").removeClass("not-displayed");
    console.error('Device not supported!');
    return false;
  }
}

async function validateLocalStorage() {
  try {
    localStorage.setItem("testing", "test");
    localStorage.removeItem("testing");
    localStorageUsable = true;

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
      console.debug(e);
      console.warn("Saving games may not be reliable!");
    }
  } catch (err) {
    console.debug(err);
    console.warn("Local Storage Test Failed!");
  }
}

