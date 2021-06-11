var screen = $("#screen")

//validation functions
function validNumBrackets(text) {
  var numLeftBrackets = text.split("").filter(n=>n==="(").length
  var numRightBrackets = text.split("").filter(n=>n===")").length
  if (numLeftBrackets === numRightBrackets) {
    return true
  }
  return false
}

function validText(text) {
  if (!"+-x÷^(.".includes(text[text.length-1]) && validNumBrackets(text)) {
    return true
  }
  return false
}

function validLeftBracket(text) {
  text += "("
  if ("+-x÷^(".includes(text[text.length-2]) || text.length===1) {
    return true
  }
  return false
}

function validRightBracket(text) {
  text += ")"
  var numLeftBracket = text.split("").filter(n=>n==="(").length
  var numRightBracket = text.split("").filter(n=>n===")").length
  if (numRightBracket > numLeftBracket || text[text.length-2] === "(") {
    return false
  }
  return true
}

function noZeroAhead() {
  var reverseScreen = screen.html().split("").reverse().join("")
  if (reverseScreen.length !== 0) {
    var index = 0
    var specialExists = false
    for (index=0;index<reverseScreen.length;index++) {
      if ("+-x÷^".includes(reverseScreen[index])) {
        specialExists = true
        break
      }
    }
    var num = ""
    if (specialExists) {
      var num = reverseScreen.slice(0,index).split("").reverse().join("")
    } else {
      var num = reverseScreen.split("").reverse().join("")
    }
    if (num[0]==="0") {
      if (num.includes(".")) {
        return true
      }
      return false
    }
    return true
  }
  return true
}

function done(text) {
  for (letter of text) {
    if ("+-x÷^()".includes(letter)) {
      return false
    }
  }
  return true
}

function symbolsOnWhichSide(statement, index) {
  var symbolOnLeft = false
  var symbolOnRight = false
  var i1 = 0
  for (i1=index-1;i1>=0;i1--) {
    if ("+-x÷^".includes(statement[i1])) {
      symbolOnLeft = true
      break
    }
  }
  var i2 = 0
  for (i2=index+1;i2<statement.length;i2++) {
    if ("+-x÷^".includes(statement[i2])) {
      symbolOnRight = true
      break
    }
  }
  if (symbolOnLeft && symbolOnRight) {
    return ["both",i1,i2]
  } else if (symbolOnLeft && !symbolOnRight) {
    return ["left",i1]
  } else if (!symbolOnLeft && symbolOnRight) {
    return ["right",i2]
  } else {
    return ["none"]
  }
}

function calcTwoNum(num1,num2,symbol) {
  console.log("num1:" + num1)
  console.log("num2:" + num2)
  if (num1[0] === "n") {
    console.log("num1(str):"+String(num1))
    num1 = (0-Number(num1.slice(1)))
  } else {
    num1 = Number(num1)
  }
  if (num2[0] === "n") {
    console.log("num2(str):"+String(num2))
    num2 = (0-Number(num2.slice(1)))
  } else {
    num2 = Number(num2)
  }
  console.log("num1" + (typeof num1))
  console.log("num2" + (typeof num2))
  console.log("num1:" + num1)
  console.log("num2:" + num2)
  console.log("symbol:"+symbol)
  console.log("symbol type:"+(typeof symbol))
  var result = 0
  if (symbol === "^") {
    console.log("Inside symbol if:pow"+(num1**num2))
    result = num1**num2
  } else if (symbol === "x") {
    console.log("Inside symbol if:mul"+(num1*num2))
    result = num1*num2
  } else if (symbol === "÷") {
    console.log("Inside symbol if:div"+(num1/num2))
    result = num1/num2
  } else if (symbol === "+") {
    console.log("Inside symbol if:add"+(num1+num2))
    result = num1+num2
  } else {
    console.log("Inside symbol if:sub"+(num1-num2))
    result = num1-num2
  }
  console.log("result:"+result)
  return result
}
//calculate numbers and symbols where there are no brackets
function calcValue(statement) {
  console.log("calcValue0-statement:"+statement)
  if (statement[0] === "-") {
    statement = "n"+statement.slice(1)
  }
  if (done(statement)) {
    console.log("calcValue1-done")
    return statement
  }
  var index = 0
  if (statement.includes("^")) {
    for (index=0;index<statement.length;index++) {
      if (statement[index] === "^") {
        break
      }
    }
    var side = symbolsOnWhichSide(statement,index)
    console.log("calcValue-side:"+side)
    var num1 = 0
    var num2 = 0
    var num = 0
    var selectedStatement = ""
    if (side[0] === "both") {
        var i1 = side[1]
        var i2 = side[2]
        selectedStatement = statement.slice(i1+1,i2)
        num1 = statement.slice(i1+1,index)
        num2 = statement.slice(index+1,i2)
        num = String(calcTwoNum(num1,num2,"^"))
        statement = statement.replace(selectedStatement,num)
    } else if (side[0] === "left") {
        var i1 = side[1]
        selectedStatement = statement.slice(i1+1)
        num1 = statement.slice(i1+1,index)
        num2 = statement.slice(index+1)
        num = String(calcTwoNum(num1,num2,"^"))
        statement = statement.replace(selectedStatement,num)
    } else if (side[0] === "right") {
        var i2 = side[1]
        selectedStatement = statement.slice(0,i2)
        num1 = statement.slice(0,index)
        num2 = statement.slice(index+1,i2)
        num = String(calcTwoNum(num1,num2,"^"))
        statement = statement.replace(selectedStatement,num)
    } else {
      num1 = statement.slice(0,index)
      num2 = statement.slice(index+1)
      statement = String(calcTwoNum(num1,num2,"^"))
    }
  } else if (statement.includes("x") || statement.includes("÷")) {
    for (index=0;index<statement.length;index++) {
      if (statement[index] === "x" || statement[index] === "÷") {
        break
      }
    }
    if (statement[index] === "x") {
      var side = symbolsOnWhichSide(statement,index)
      var num1 = 0
      var num2 = 0
      var num = 0
      var selectedStatement = ""
      if (side[0] === "both") {
          var i1 = side[1]
          var i2 = side[2]
          selectedStatement = statement.slice(i1+1,i2)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"x"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "left") {
          var i1 = side[1]
          selectedStatement = statement.slice(i1+1)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1)
          num = String(calcTwoNum(num1,num2,"x"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "right") {
          var i2 = side[1]
          selectedStatement = statement.slice(0,i2)
          num1 = statement.slice(0,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"x"))
          statement = statement.replace(selectedStatement,num)
      } else {
        num1 = statement.slice(0,index)
        num2 = statement.slice(index+1)
        statement = String(calcTwoNum(num1,num2,"x"))
      }
    } else {
      var side = symbolsOnWhichSide(statement,index)
      var num1 = 0
      var num2 = 0
      var num = 0
      var selectedStatement = ""
      if (side[0] === "both") {
          var i1 = side[1]
          var i2 = side[2]
          selectedStatement = statement.slice(i1+1,i2)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"÷"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "left") {
          var i1 = side[1]
          selectedStatement = statement.slice(i1+1)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1)
          num = String(calcTwoNum(num1,num2,"÷"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "right") {
          var i2 = side[1]
          selectedStatement = statement.slice(0,i2)
          num1 = statement.slice(0,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"÷"))
          statement = statement.replace(selectedStatement,num)
      } else {
        num1 = statement.slice(0,index)
        num2 = statement.slice(index+1)
        statement = String(calcTwoNum(num1,num2,"÷"))
      }
    }
  } else if (statement.includes("+") || statement.includes("-")) {
    for (index=0;index<statement.length;index++) {
      if (statement[index] === "+" || statement[index] === "-") {
        break
      }
    }
    if (statement[index] === "+") {
      var side = symbolsOnWhichSide(statement,index)
      var num1 = 0
      var num2 = 0
      var num = 0
      var selectedStatement = ""
      if (side[0] === "both") {
          var i1 = side[1]
          var i2 = side[2]
          selectedStatement = statement.slice(i1+1,i2)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"+"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "left") {
          var i1 = side[1]
          selectedStatement = statement.slice(i1+1)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1)
          num = String(calcTwoNum(num1,num2,"+"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "right") {
          var i2 = side[1]
          selectedStatement = statement.slice(0,i2)
          num1 = statement.slice(0,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"+"))
          statement = statement.replace(selectedStatement,num)
      } else {
        num1 = statement.slice(0,index)
        num2 = statement.slice(index+1)
        statement = String(calcTwoNum(num1,num2,"+"))
      }
    } else {
      var side = symbolsOnWhichSide(statement,index)
      var num1 = 0
      var num2 = 0
      var num = 0
      var selectedStatement = ""
      if (side[0] === "both") {
          var i1 = side[1]
          var i2 = side[2]
          selectedStatement = statement.slice(i1+1,i2)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"-"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "left") {
          var i1 = side[1]
          selectedStatement = statement.slice(i1+1)
          num1 = statement.slice(i1+1,index)
          num2 = statement.slice(index+1)
          num = String(calcTwoNum(num1,num2,"-"))
          statement = statement.replace(selectedStatement,num)
      } else if (side[0] === "right") {
          var i2 = side[1]
          selectedStatement = statement.slice(0,i2)
          num1 = statement.slice(0,index)
          num2 = statement.slice(index+1,i2)
          num = String(calcTwoNum(num1,num2,"-"))
          statement = statement.replace(selectedStatement,num)
      } else {
        num1 = statement.slice(0,index)
        num2 = statement.slice(index+1)
        statement = String(calcTwoNum(num1,num2,"-"))
      }
    }
  }
  console.log("calcValue2:"+statement)
  return calcValue(statement)
}

function refine(text) {
  console.log("refine1:"+text)
  var bracket = false
  for (letter of text) {
    if ("(".includes(letter)) {
        bracket = true
    }
  }
  if (bracket) {
    var i2 = 0
    for (i2=0;i2<text.length;i2++) {
      if (text[i2]===")") {
        break
      }
    }
    var i1 = 0
    for (i1=i2-2;i1>=0;i1--) {
      if (text[i1]==="(") {
        break
      }
    }
    var statement = text.slice(i1+1,i2)
    var bracketStatement = text.slice(i1,i2+1)
    var value = ""
    if (statement[0] !== "-") {
      console.log("refine2-statement:"+statement)
      value = String(calcValue(statement))
    } else {
      value  = "n"+statement.slice(1)
    }
    console.log("refine3-value:"+value)
    text = text.replace(bracketStatement,value)
  } else {
    text = String(calcValue(text))
  }
  console.log("refine4:"+text)
  return text
}

function calculate(text) {
  if (done(text)) {
    return text
  }
  text = refine(text)
  return calculate(text)
}

//number functions
one = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "1")
  }
}
two = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "2")
  }
}
three = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "3")
  }
}
four = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "4")
  }
}
five = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "5")
  }
}
six = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "6")
  }
}
seven = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "7")
  }
}
eight = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "8")
  }
}
nine = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "9")
  }
}
zero = () => {
  if (screen.html()[screen.html().length-1] !== ")" && noZeroAhead()) {
    screen.html(screen.html() + "0")
  }
}

//backarrow,reset
backarrow = () => screen.html(screen.html().slice(0,screen.html().length-1))
reset = () => screen.html("")

//specials
leftBracket = () => {
  if (validLeftBracket(screen.html())) {
    screen.html(screen.html() + "(")
  }
}
rightBracket = () => {
  if (validRightBracket(screen.html())) {
    screen.html(screen.html() + ")")
  }
}
point = () => {
  var reverseScreen = screen.html().split("").reverse().join("")
  if (reverseScreen.length !== 0) {
    if (!"+-x÷^()".includes(reverseScreen[0])) {
      var index = 0
      var specialExists = false
      for (index=0;index<reverseScreen.length;index++) {
        if ("+-x÷^()".includes(reverseScreen[index])) {
          specialExists = true
          break
        }
      }
      var num = ""
      if (specialExists) {
        var num = reverseScreen.slice(0,index).split("").reverse().join("")
      } else {
        var num = reverseScreen.split("").reverse().join("")
      }
      var numPoint = num.split("").filter(n=>n===".").length
      if (numPoint === 0) {
        screen.html(screen.html() + ".")
      }
    }
  }
}

add = () => {
  if (!"+-x÷^(".includes(screen.html()[screen.html().length-1]) && screen.html().length !== 0) {
    screen.html(screen.html() + "+")
  }
}
sub = () => {
  if (!"+-x÷^".includes(screen.html()[screen.html().length-1]) && screen.html().length !== 0) {
    screen.html(screen.html() + "-")
  }
}
mul = () => {
  if (!"+-x÷^(".includes(screen.html()[screen.html().length-1]) && screen.html().length !== 0) {
    screen.html(screen.html() + "x")
  }
}
div = () => {
  if (!"+-x÷^(".includes(screen.html()[screen.html().length-1]) && screen.html().length !== 0) {
    screen.html(screen.html() + "÷")
  }
}
pow = () => {
  if (!"+-x÷^(".includes(screen.html()[screen.html().length-1]) && screen.html().length !== 0) {
    screen.html(screen.html() + "^")
  }
}

//equals
equals = () => {
  var text = screen.html()
  if (validText(text)) {
    var answer = calculate(text)
    if (answer[0] === "n") {
      answer = "-" + answer.slice(1)
    }
    screen.html(answer)
  } else {
    alert("Invalid Input")
  }
}
