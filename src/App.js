import React, { Component } from 'react';
import './App.css';

class Calc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      decimal: 1,
      txt: 0,
      output: '',
      operand: '',
      parenCount: 0,
      arr: []
    }
  }

  btnInput = (input) => {
    let val = this.state.output
    let { parenCount, decimal } = this.state

    if (input === '.' && decimal === 0) {
      console.log('Already has decimal')
    } else if (input === '.' && decimal !== 0) {
      val += '.';
      decimal -= 1;
    } else if (/[0-9]/.test(input)) {
      val += input;
    } else if (/[()]/.test(input)) {
      val += input;
      switch (input) {
        case ('('):
          parenCount += 1;
          break;
        case (')'):
          parenCount -= 1;
          break;
        default:
          break;
      }
      console.log('parenthesis: ' + parenCount)
    }

    this.setState({ txt: val, output: val, parenCount: parenCount, decimal: decimal })
    console.log(val)
  }


  opInput = (input) => {
    let val = this.state.output
    if (input === 'C') {
      val = 0;
      this.setState({ txt: 0, output: '', arr: [], decimal: 1, parenCount: 0 })
    } else if (input === 'CE') {
      let updatedTxt = val.toString().substr(0, val.length - 1);
      val = updatedTxt;
      switch (updatedTxt) {
        case (0 || ""):
          this.setState({ txt: 0, output: "" })
          break;

        default:
          this.setState({ txt: updatedTxt, output: updatedTxt })
      }
    } else if (val.charAt(val.length - 1) === '+' ||
      val.charAt(val.length - 1) === '-' ||
      val.charAt(val.length - 1) === '*' ||
      val.charAt(val.length - 1) === '/'
    ) {
      let updatedTxt = val.toString().substr(0, val.length - 1) + input
      val = updatedTxt
      this.setState({ txt: updatedTxt, output: updatedTxt, decimal: 1 })
    } else {
      val += input;
      this.setState({ txt: val, output: val, decimal: 1 })
    }

    console.log(val)
    this.setState({ decimal: 1 })
  }

  evalInput = () => {
    let checkBr = /[()]/;
    let checkNum = /[0-9]/;
    let checkOp = /[-+*/]/;
    let num = "";
    let outArr = [];
    let opArr = [];
    const { output, parenCount, arr } = this.state;

    if (output === 0) {
    } else if (
      output.slice(-1) === "+" ||
      output.slice(-1) === "-" ||
      output.slice(-1) === "*" ||
      output.slice(-1) === "/"
    ) {
      let toArr = output.split("");
      toArr.pop();
      let joinArr = toArr.join("");
      this.setState({ output: joinArr });
    } else if (parenCount !== 0 && parenCount !== "") {
      switch (parenCount) {
        case (parenCount > 0):
          alert(`missing ${parenCount} closing parenthesis`);
          break;
        case (parenCount < 0):
          let newCount = (-1) * parenCount
          alert(`missing ${newCount} opening brackets`);
          break;
        default:
          break;
      }
    } else {
      for (let i = 0; i < output.length; i++) {
        if (
          output[i] === "+" ||
          output[i] === "-" ||
          output[i] === "*" ||
          output[i] === "/" ||
          output[i] === "(" ||
          output[i] === ")"
        ) {
          this.setState({ arr: arr.push(output[i], "") });
          num = "";
        } else {
          arr.pop();
          num += output[i];
          this.setState({ arr: arr.push(num) });
        }
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") arr.splice(i, 1)
      }
      console.log('arr', arr)
    }
    arr.forEach(element => {
      if (checkNum.test(element)) {
        outArr.push(parseFloat(element));
      } else if (checkOp.test(element)) {
        if (element === '*' || element === '/') {
          if (
            opArr[opArr.length - 1] === "*" ||
            opArr[opArr.length - 1] === "/"
          ) {
            outArr.push(opArr.pop());
            opArr.push(element);
          } else {
            opArr.push(element);
          }
        } else if (element === "+" || element === "-") {
          if (
            opArr[opArr.length - 1] === "*" ||
            opArr[opArr.length - 1] === "/"
          ) {
            while (opArr.length !== 0) {
              outArr.push(opArr.pop());
            }
            opArr.push(element);

          } else if (
            element === "-" &&
            opArr[opArr.length - 1] === "-"
          ) {
            outArr.push(element);
          } else if (
            element === "+" &&
            opArr[opArr.length - 1] === "-"
          ) {
            outArr.push(element)
          } else {
            opArr.push(element);
          }
        }
      } else if (checkBr.test(element)) {
        if (element === "(") {
          opArr.push(element);
        } else {
          while (opArr[opArr.length - 1] !== "(") {
            outArr.push(opArr.pop());
          }
          opArr.pop();
        }
      }
    });
    while (opArr.length !== 0) {
      outArr.push(opArr.pop());
    }
    console.log("output", outArr);

    for (let i = 0; i < outArr.length; i++) {
      console.log(typeof outArr[i] !== "number");
      if (typeof outArr[i] !== "number") {
        let total = 0;
        let opIndex = outArr.indexOf(outArr[i])

        let finalOp = outArr[opIndex];

        let num1 = outArr[opIndex - 2];

        let num2 = outArr[opIndex - 1];

        if (finalOp === "*") {
          total = num1 * num2;
        } else if (finalOp === "/") {
          total = num1 / num2;
        } else if (finalOp === "+") {
          total = num1 + num2;
        } else if (finalOp === "-") {
          total = num1 - num2;
        }

        outArr.splice(opIndex - 2, 3, total);
        i -= 3;
      }
    }

    // let strOutput = String(outArr[0])
    // let finResult;

    // switch (/[-]/.test(strOutput)) {
    //   case(true):
    //     finResult = `(${strOutput})`;
    //     break;

    //   default:
    //     finResult = strOutput;
    //     break;
    // }
    // console.log(finResult)

    console.log(outArr);
    this.setState(
      outArr[0] === 0 ? { txt: 0, output: '' } : { txt: String(outArr[0]), output: String(outArr[0]) }
    );

    this.setState({ arr: [outArr[0]] })
  }

  render() {
    const { txt } = this.state;

    return (

      <div id='bg'>
        <div className='container'>
          <div className='display'>
            <p className='disTxt'>{txt}</p>
          </div>

          <div className='row'>
            <button className='btn' onClick={() => this.btnInput("(")}>(</button>
            <button className='btn' onClick={() => this.opInput("CE")}>CE</button>
            <button className='btn' onClick={() => this.btnInput(")")}>)</button>
            <button className='btn' onClick={() => this.opInput("C")}>C</button>
          </div>
          <div className='row'>
            <button className='btn' onClick={() => this.btnInput("1")}>1</button>
            <button className='btn' onClick={() => this.btnInput("2")}>2</button>
            <button className='btn' onClick={() => this.btnInput("3")}>3</button>
            <button className='btn' onClick={() => this.opInput("+")}>+</button>
          </div>
          <div className='row'>
            <button className='btn' onClick={() => this.btnInput("4")}>4</button>
            <button className='btn' onClick={() => this.btnInput("5")}>5</button>
            <button className='btn' onClick={() => this.btnInput("6")}>6</button>
            <button className='btn' onClick={() => this.opInput("-")}>-</button>
          </div>
          <div className='row'>
            <button className='btn' onClick={() => this.btnInput("7")}>7</button>
            <button className='btn' onClick={() => this.btnInput("8")}>8</button>
            <button className='btn' onClick={() => this.btnInput("9")}>9</button>
            <button className='btn' onClick={() => this.opInput("*")}>*</button>
          </div>
          <div className='row'>
            <button className='btn' onClick={() => this.btnInput(".")}>.</button>
            <button className='btn' onClick={() => this.btnInput("0")}>0</button>
            <button className='btn' onClick={() => this.evalInput()}>=</button>
            <button className='btn' onClick={() => this.opInput("/")}>÷</button>
          </div>

        </div>
      </div>
    )
  }
}

export default Calc