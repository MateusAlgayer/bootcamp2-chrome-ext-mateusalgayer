let timer_minutes = 30;
chrome.storage.local.get(['timer_minutes']).then((result) => {
  timer_minutes = result.timer_minutes || 30;
});

function startTimer() {
  chrome.alarms.create('pomodoro', { duration: timer_minutes * 60 });
  return { started: true };
}

function pauseTimer() {
  chrome.alarms.pause('pomodoro');
  return { paused: true };
}

function resetTimer() {
  chrome.alarms.clear('pomodoro');
  return { reset: true };
}

function setTimer(mins) {
  chrome.storage.local.set({ timer_minutes: mins });
  timer_minutes = mins;
  return { minutesSet: timer_minutes };
}

function getTimer() {
  chrome.alarms.get('pomodoro', (alarm) => {
    if (alarm) {
      const minutesLeft = (alarm.scheduledTime - Date.now()) / 60000; // em minutos
      const secondsLeft = (alarm.scheduledTime - Date.now()) / 1000; // em segundos
      return {
        minutesLeft: Math.ceil(minutesLeft), 
        secondsLeft: Math.ceil(secondsLeft)
      };
    } else {
      return { 
        minutesLeft: 0, 
        secondsLeft: 0 
      };
    }
  });
}

//===================================
// Listener de mensagens do popup
//=================================== 

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'START':
      return startTimer();
    case 'PAUSE':
      return pauseTimer();
    case 'RESET':
      return resetTimer();
    case 'TIMER_SET':
      return setTimer(msg.minutes);
    case 'TIMER_GET':
      return getTimer();
    default:
      return { error: 'Mensagem inválida!' };
  }
});