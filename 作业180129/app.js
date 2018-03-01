(function() {
  let inputFlag = 0;
  const Character = new function() {
    this.isDigit = char =>
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].indexOf(char) >
      -1;
  }();
  function min(...arr) {
    return arr.sort(function(a, b) {
      if (a < 0) return true;
      if (b < 0) return false;
      return a - b;
    })[0];
  }
  /**
   * 计算一个表达式
   * @param {string} 输入的合法表达式
   * @return {string} 返回的结果字符串
   */
  function calc(e) {
    if (e.length <= 0) {
      return "";
    }
    let start = -1;
    let end = -1;
    let counter = 0;
    let flag = 0;
    for (let i = 0; i < e.length; i++) {
      if (e.charAt(i) == "(") {
        if (start == -1) {
          start = i;
          flag = 1;
        }
        counter++;
      }
      if (e.charAt(i) == ")") {
        counter--;
        if (counter == 0) {
          end = i;
          break;
        }
      }
    }
    let l, r;
    l = "";
    r = "";
    if (flag == 1) {
      if (start > 0) {
        l = e.substring(0, start);
      }
      if (e.length - end > 0) {
        r = e.substring(end + 1, e.length);
      }
      return calc(l + calc(e.substring(start + 1, end)) + r);
    }
    let index;
    if (e.indexOf("^") > -1) {
      flag = 2;
      index = e.indexOf("^");
    } else if (
      e.indexOf("×") > -1 ||
      e.indexOf("÷") > -1 ||
      e.indexOf("%") > -1
    ) {
      flag = 3;
      let a = e.indexOf("×");
      let b = e.indexOf("÷");
      let c = e.indexOf("%");
      index = min(a, b, c);
    } else if (
      e.indexOf("+") > -1 ||
      (e.length > 0 && e.substring(1).indexOf("-") > -1)
    ) {
      flag = 4;
      let a = e.indexOf("+");
      let b = e.substring(1).indexOf("-") + 1;
      if ((a > 0 && b > 0 && a < b) || (a > 0 && b == 0)) {
        index = a;
      } else {
        index = b;
      }
    } else {
      index = -1;
    }
    if (flag > 1) {
      let superFlag = false;
      start = 0;
      for (let i = index - 1; i > -1; i--) {
        if (!Character.isDigit(e.charAt(i))) {
          if (!superFlag && e.charAt(i) == "-") {
            superFlag = true;
            continue;
          }
          start = i + 1;
          break;
        } else if (superFlag) {
          start = i + 2;
          break;
        }
      }
      superFlag = false;
      let i = index + 1;
      end = e.length - 1;
      if (e.charAt(index + 1) == "-") {
        superFlag = true;
        i = index + 2;
      }
      for (; i < e.length; i++) {
        if (!Character.isDigit(e.charAt(i))) {
          end = i - 1;
          break;
        }
      }
      let strL = e.substring(start, index);
      let strR = e.substring(index + 1, end + 1);
      let numL = 0;
      let numR = 0;
      if (strL.length > 0) {
        numL = parseFloat(strL);
      }
      if (strR.length > 0) {
        numR = parseFloat(strR);
      }
      let result = 0;
      switch (flag) {
        case 2: {
          result = Math.pow(numL, numR);
          break;
        }
        case 3: {
          if (e.charAt(index) == "×") {
            result = numL * numR;
          } else if (e.charAt(index) == "÷") {
            result = numL / numR;
          } else {
            result = numL % numR;
          }
          break;
        }
        case 4: {
          if (e.charAt(index) == "+") {
            result = numL + numR;
          } else {
            result = numL - numR;
          }
          break;
        }
      }
      if (start > 0) {
        l = e.substring(0, start);
      }
      if (e.length - 1 - end > 0) {
        r = e.substring(end + 1, e.length);
      }
      return calc(l + result + r);
    }
    for (let i = 0; i < e.length; i++) {
      if (!(Character.isDigit(e.charAt(i)) || e.charAt(i) == "-")) {
        throw "Wrong!";
      }
    }
    return e;
  }
  function textOnchange() {
    const DOM = document.getElementById("inputText");
    const parentDOM = DOM.parentElement;
    const boxWidth = parentDOM.offsetWidth - 16;
    const contentWidth = DOM.offsetWidth;
    //console.log(boxWidth - contentWidth);
    if (contentWidth > boxWidth) {
      DOM.style.left = `${(boxWidth - contentWidth) / 2}px`;
      DOM.style.transform = `scale(${boxWidth / contentWidth})`;
    } else {
      DOM.style.left = "0px";
      DOM.style.transform = "scale(1)";
    }
  }
  document.getElementById("clear").addEventListener("click", function(e) {
    if (inputFlag == 0) {
      document.getElementById("inputText").innerText = "";
      document.getElementById("inputText").innerText = "输入算式";
    } else {
      document.getElementById("inputText").innerText = document
        .getElementById("inputText")
        .innerText.substr(
          0,
          document.getElementById("inputText").innerText.length - 1
        );
      if (document.getElementById("inputText").innerText.length < 1) {
        document.getElementById("inputText").innerText = "输入算式";
        inputFlag = 0;
      }
    }
    textOnchange();
  });
  document.getElementById("key=").addEventListener("click", function(e) {
    const DOM = document.getElementById("inputText");
    let toSet = DOM.innerText;
    const result = function() {
      const wrong = "无效输入";
      try {
        let re = calc(DOM.innerText);
        console.log("OK");
        inputFlag = 2;
        return re;
      } catch (e) {
        console.log(wrong);
        inputFlag = 0;
        return wrong;
      }
    };
    DOM.innerText = result();
    textOnchange();
  });
  //绑定点击按钮
  [
    "(",
    ")",
    //"%",
    //"÷",
    "7",
    "8",
    "9",
    //"×",
    "4",
    "5",
    "6",
    //"-",
    "1",
    "2",
    "3",
    //"+",
    //"^",
    "0",
    "."
    //"="
  ].forEach(e => {
    const domKey = `key${e}`;
    document.getElementById(domKey).addEventListener("click", function(event) {
      if (inputFlag != 1) {
        document.getElementById("inputText").innerText = "";
        inputFlag = 1;
      }
      document.getElementById("inputText").innerText += e;
      textOnchange();
    });
  });
  //绑定点击按钮
  ["%", "÷", "×", "-", "+", "^"].forEach(e => {
    const domKey = `key${e}`;
    document.getElementById(domKey).addEventListener("click", function(event) {
      if (inputFlag == 0) {
        document.getElementById("inputText").innerText = "";
      }
      inputFlag = 1;
      document.getElementById("inputText").innerText += e;
      textOnchange();
    });
  });
  function reSetWidth() {
    const mainDOM = document.getElementsByClassName("calcDiv")[0];

    const contentWidth = mainDOM.offsetWidth;
    const boxWidth = document.documentElement.clientWidth;

    let transform = boxWidth / contentWidth;

    const contentWidth2 = mainDOM.offsetHeight;
    const boxWidth2 = document.documentElement.clientHeight;

    let transform2 = boxWidth2 / contentWidth2;

    //console.log(transform, transform2);
    let minTransform = min(transform, transform2);
    mainDOM.style.left = `${(boxWidth - contentWidth) / 2}px`;
    mainDOM.style.top = `${(boxWidth2 - contentWidth2) / 2}px`;
    mainDOM.style.transform = `scale(${minTransform})`;
  }
  reSetWidth();
  window.addEventListener("resize", function(e) {
    reSetWidth();
  });

  //暴露接口
  window["calc"] = calc;
})();

/**去重函数
 * @param {Array<>} arr 要去重的数组或对象
 * @param {function} fun 可选，是否为重复项的判断依据
 */
function deDuplication(
  arr,
  fun = function(a, b) {
    if (typeof a === typeof b) {
      switch (typeof a) {
        case "number": {
          return a === b;
          break;
        }
        case "string": {
          return a == b;
          break;
        }
        case "object": {
          for (let i in a) {
            if (b[i]) {
              if (!(a[i] == b[i])) {
                return false;
              }
            } else {
              return false;
            }
          }
          for (let i in b) {
            if (a[i]) {
              if (!(a[i] == b[i])) {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        }
      }
    } else {
      return false;
    }
  }
) {
  _arr = arr.slice();
  for (let i in _arr) {
    for (let j in _arr) {
      if (i == j) {
        continue;
      }
      if (fun(arr[i], arr[j])) {
        _arr.splice(j, 1);
      }
    }
  }
  return _arr;
}

/**排序函数
 * @param {Array<>} arr 要排序的数组
 * @param {Function} order 可选，比较依据
 * @param {string} mode 可选，排序方式
 * @return {Array<>} 返回的新数组
 */
function sort(
  arr,
  order = function(a, b) {
    return a > b;
  },
  mode = "quick"
) {
  if (arr.length <= 0) {
    return arr.slice();
  }
  let _arr = arr.slice();
  let temp;
  mode = mode.toLowerCase();
  switch (mode) {
    case "quick": {
      console.log("QuickSort ing...");
      /**快速排序实现
       * @param {Array<>} arr
       * @param {number} l
       * @param {number} r
       */
      function quickSort(arr, l = 0, r = arr.length - 1) {
        if (l >= r) return;
        let left = l;
        let right = r;
        let pointer = arr[left];
        for (;;) {
          for (; right > left; right--) {
            if (order(pointer, arr[right])) {
              temp = arr[left];
              arr[left] = arr[right];
              arr[right] = temp;
              break;
            }
          }
          //console.log(arr);
          if (left == right) {
            quickSort(arr, l, left - 1);
            quickSort(arr, right + 1, r);
            break;
          }
          for (; right > left; left++) {
            if (order(arr[left], pointer)) {
              temp = arr[left];
              arr[left] = arr[right];
              arr[right] = temp;
              break;
            }
          }
          if (left == right) {
            quickSort(arr, l, left - 1);
            quickSort(arr, right + 1, r);
            break;
          }
        }
      }
      quickSort(_arr);
      break;
    }
  }
  return _arr;
}
//测试用例 去重

deDuplication([110, 11, 123, 123]);
deDuplication([456, 112, 112, 112]);

deDuplication([{ a: 1, b: 2, c: 3 }, { a: 1, b: 1 }, { a: 1, b: 2, c: 3 }]);

deDuplication([
  {
    toString: function() {
      return 1;
    }
  },
  1,
  1,
  5
]);

//测试用例 输入表达式计算
calc("56+(48-2×5÷(2^(5-3))×5)");

//测试用例 排序
sort([123, 554, 61, 89, 4665, 0.25]);
