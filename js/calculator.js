document.addEventListener('DOMContentLoaded', function() {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        calculated: false // 新增标志位，表示是否已完成计算
    };

    function updateDisplay() {
        const display = document.getElementById('display');
        display.value = calculator.displayValue;
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand, calculated } = calculator;
        
        if (calculated) {
            // 如果已完成计算，新输入数字时重置状态
            calculator.displayValue = digit;
            calculator.calculated = false;
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        if (calculator.calculated) {
            calculator.displayValue = '0.';
            calculator.calculated = false;
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator, calculated } = calculator;
        const inputValue = parseFloat(displayValue);
        
        if (calculated) {
            calculator.operator = nextOperator;
            calculator.calculated = false;
            return;
        }
        
        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }
        
        if (firstOperand == null) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }
        
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    function handleEqual() {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);
        
        if (firstOperand == null || operator == null) {
            return; // 没有足够的操作数
        }
        
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
        calculator.waitingForSecondOperand = true;
        calculator.calculated = true; // 标记计算已完成
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        calculator.calculated = false;
    }

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }
        
        if (target.classList.contains('operator')) {
            handleOperator(target.value);
            updateDisplay();
            return;
        }
        
        if (target.classList.contains('decimal')) {
            inputDecimal(target.value);
            updateDisplay();
            return;
        }
        
        if (target.classList.contains('all-clear')) {
            resetCalculator();
            updateDisplay();
            return;
        }
        
        if (target.classList.contains('equal-sign')) {
            handleEqual();
            updateDisplay();
            return;
        }
        
        inputDigit(target.value);
        updateDisplay();
    });

    updateDisplay();
});