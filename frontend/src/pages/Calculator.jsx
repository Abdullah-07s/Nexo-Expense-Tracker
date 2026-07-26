import { useState } from 'react';
import Layout from '../components/Layout';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForNewValue) {
      setDisplay(String(digit));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '\u00d7': return a * b;
      case '\u00f7': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const togglePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const buttons = [
    { label: 'AC', action: clear, className: 'bg-[#1a1a24] text-green-400 hover:bg-[#22222e]' },
    { label: '()', action: () => {}, className: 'bg-[#1a1a24] text-gray-300 hover:bg-[#22222e]' },
    { label: '%', action: togglePercent, className: 'bg-[#1a1a24] text-gray-300 hover:bg-[#22222e]' },
    { label: '\u00f7', action: () => performOperation('\u00f7'), className: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' },
    { label: '7', action: () => inputDigit(7), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '8', action: () => inputDigit(8), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '9', action: () => inputDigit(9), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '\u00d7', action: () => performOperation('\u00d7'), className: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' },
    { label: '4', action: () => inputDigit(4), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '5', action: () => inputDigit(5), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '6', action: () => inputDigit(6), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '\u2212', action: () => performOperation('-'), className: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' },
    { label: '1', action: () => inputDigit(1), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '2', action: () => inputDigit(2), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '3', action: () => inputDigit(3), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '+', action: () => performOperation('+'), className: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' },
    { label: '0', action: () => inputDigit(0), className: 'bg-[#1a1a24] text-white hover:bg-[#22222e] col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-[#1a1a24] text-white hover:bg-[#22222e]' },
    { label: '=', action: handleEquals, className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700' },
  ];

  return (
    <Layout>
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calculator</h1>

        <div className="bg-[#13131a] border border-[#2a2a38] rounded-2xl p-5">
          <div className="text-right mb-4 px-2">
            <p className="text-xs text-gray-500 mb-1">
              {previousValue !== null ? `${previousValue} ${operator || ''}` : ''}
            </p>
            <p className="text-4xl font-semibold truncate">{display}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={`py-4 rounded-xl font-medium text-lg transition ${btn.className}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
