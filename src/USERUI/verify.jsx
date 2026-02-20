import { useState, useRef, useEffect } from "react";

function Verify({ isOpen, onClose, onSubmit }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setError("");
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join("");

    if (fullPin.length !== 4) {
      setError("Enter 4-digit PIN");
      return;
    }

    const result = await onSubmit(fullPin);

    if (!result.success) {
      setError("Incorrect pin");
      setPin(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    setPin(["", "", "", ""]);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[380px] shadow-2xl text-center space-y-6">

        <h2 className="text-xl font-bold text-gray-800">
          Enter 4-Digit PIN
        </h2>

        {/* PIN Inputs */}
        <div className="flex justify-center gap-8">
          {pin.map((digit, index) => (
            <input
              key={index}
              type="text"   // ← shows actual numbers
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                w-12
                text-center
                text-3xl
                font-semibold
                bg-transparent
                border-b-2
                ${error ? "border-rose-500" : "border-gray-400"}
                focus:border-teal-800
                focus:outline-none
                transition-all
                duration-200
              `}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-rose-600 text-sm font-medium">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">

          {/* Cancel */}
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg bg-teal-800 text-white font-semibold hover:bg-teal-700 active:scale-95 transition"
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
}

export default Verify;