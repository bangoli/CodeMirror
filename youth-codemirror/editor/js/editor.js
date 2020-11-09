
/**
 * 请求载入并执行一个 JavaScript 文件
 *
 * @method getScript
 * @param {String} url js文件的url
 * @param {Function} [callback] 成功回调函数
 * @return {void} 无返回
 */
function getScript(url, resolve, reject) {
  const script = document.createElement('script');
  script.async = 'async';
  script.src = url;
  script.onload = resolve || (() => {});
  script.onerror = reject || (() => { console.error('load js err:', url) });
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * get query str value
 * @param name
 * @returns {string|null}
 */
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

var editor;
var input = document.getElementById("select");
var iTheme = getQueryString('theme');
var languages = {
  js: '../../mode/javascript/javascript.js',
  py: '../../mode/python/python.js',
  c: '../../mode/clike/clike.js',
}
var language = getQueryString('lang') || '';
console.log('---editor i:', language);
language = language && languages[language] || languages.c;

/**
 * 设置模版
 */
function selectTheme(data) {
  var theme = data || input.options[input.selectedIndex].value;
  // var theme = input.options[input.selectedIndex].textContent;
  theme && editor && editor.setOption("theme", theme);
}

/**
 * 初始化
 */
function initCode() {
  editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
  });

  if (iTheme) {
    selectTheme(iTheme);
    input.value = iTheme;
  }

  // console.log('---editor:', editor.getValue());
  editor.setValue(`
      function findSequence(goal) {
        function find(start, history) {
          if (start == goal)
            return history;
          else if (start > goal)
            return null;
          else
            return find(start + 5, "(" + history + " + 5)") ||
                   find(start * 3, "(" + history + " * 3)");
        }
        return find(1, "1");
      }`)
}

getScript(language, initCode);

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  // For Chrome, the origin property is in the event.originalEvent
  // object.
  // 这里不准确，chrome没有这个属性
  // var origin = event.origin || event.originalEvent.origin;
  var origin = event.origin;
  console.log('editor:', origin);
  if (origin !== "http://example.org:8080")
    return;

  // ...
}
