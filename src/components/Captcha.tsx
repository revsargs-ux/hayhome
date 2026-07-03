"use client";
import { useState, useEffect } from "react";

interface Props {
  onVerify: (token: string) => void;
  reset?: number;
}

export default function Captcha({ onVerify, reset }: Props) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setA(Math.floor(Math.random() * 8) + 1);
    setB(Math.floor(Math.random() * 8) + 1);
    setAnswer("");
    setVerified(false);
  }, [reset]);

  const check = (val: string) => {
    setAnswer(val);
    if (parseInt(val) === a + b) {
      setVerified(true);
      onVerify(`math_${a + b}_${Date.now()}`);
    } else {
      setVerified(false);
      onVerify("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
        <span className="text-sm font-mono font-bold text-gray-700 select-none" style={{ textDecoration: 'line-through', textDecorationColor: 'transparent' }}>
          {a} + {b} =
        </span>
        <input
          type="number"
          value={answer}
          onChange={(e) => check(e.target.value)}
          className="w-14 text-sm text-center border-0 bg-transparent focus:outline-none"
          placeholder="?"
          inputMode="numeric"
        />
        {verified ? (
          <span className="text-green-600 text-sm">✓</span>
        ) : answer && !verified ? (
          <span className="text-red-500 text-sm">✗</span>
        ) : null}
      </div>
    </div>
  );
}
