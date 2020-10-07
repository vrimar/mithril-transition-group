require('jsdom-global')(undefined, { pretendToBeVisual: true });

let lastTime = 0;

global.requestAnimationFrame = (callback) => {
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
  var id = window.setTimeout(function () { callback(currTime + timeToCall); },
    timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};

global.cancelAnimationFrame = () => { }
