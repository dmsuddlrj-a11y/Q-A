// ★ 이 한 줄만 선생님 앱스 스크립트 '웹 앱 URL'로 바꿔 주세요. (https://script.google.com/macros/s/.../exec)
var API_URL = 'https://script.google.com/macros/s/AKfycbxIngK1v6vnL7Wq7IPqIh6IZcFKnjy0zdxoEZqq2FzRdOHGcIu0ZrzzlKbRTMlhO6zQ/exec';

// 화면 코드의 google.script.run.함수이름(...) 을 그대로 쓸 수 있게 해 주는 연결 장치예요.
// 안쪽에서는 fetch로 앱스 스크립트(doPost)에 요청을 보내요.
function makeRunner_(onOk, onFail) {
  return new Proxy({}, {
    get: function (_, name) {
      if (name === 'withSuccessHandler') return function (f) { return makeRunner_(f, onFail); };
      if (name === 'withFailureHandler') return function (f) { return makeRunner_(onOk, f); };
      return function () {
        var args = Array.prototype.slice.call(arguments);
        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // 꼭 text/plain (오류 방지)
          body: JSON.stringify({ fn: String(name), args: args })
        })
          .then(function (r) { return r.json(); })
          .then(
            function (res) { if (onOk) onOk(res); },
            function (err) { if (onFail) onFail(err); }
          );
      };
    }
  });
}

var google = { script: { run: makeRunner_() } };
