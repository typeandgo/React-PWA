let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt event fired!');

  event.preventDefault();

  if (deferredPrompt === null) {

    deferredPrompt = event;
  }
  
  return false;
});

export const installationBanner = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {

      if (choiceResult.outcome === 'dismissed') {

        console.log('Add to home screen ignored');

      } else {

        console.log('Add to home screen accepted');
      };

      deferredPrompt = false; // User made a choice so not suggest again.
    });
  }
}