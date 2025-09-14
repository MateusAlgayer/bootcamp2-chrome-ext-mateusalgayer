//===================================
// API Alarms do Chrome
//===================================

function startTimer(minutes) {
  chrome.alarms.create('pomodoro', { 
    delayInMinutes: minutes, 
    periodInMinutes: 99999 // para não repetir 
  });

  chrome.alarms.onAlarm.removeListener(() => {});
  chrome.alarms.onAlarm.addListener(
    (alarm) => {
      if (alarm.name === 'pomodoro') {
        chrome.notifications.create(Date.now().toString(), {
          type: "basic",
          iconUrl: "../assets/logo.png",
          title: "Atenção!",
          message: "O tempo do Pomodoro acabou!",
          priority: 2
        });
      }
    }
  );
  return true;
}

function resetTimer() {
  try {
    chrome.alarms.clear('pomodoro');
    return true;
  } catch (error) {
    return false;
  }
}

//===================================
// Listener de mensagens do popup
//=================================== 

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'START':
      resetTimer(); // Reseta antes de iniciar
      res = startTimer(msg.minutes);
      return sendResponse({ 
        started: res, 
        error: res ? null : 'Erro ao iniciar o temporizador!' 
      });
    case 'RESET':
      res = resetTimer();
      return sendResponse({ 
        reset: res, 
        error: res ? null : 'Erro ao reiniciar o temporizador!' 
      });
    default:
      return sendResponse({ error: 'Mensagem inválida!' });
  }
});