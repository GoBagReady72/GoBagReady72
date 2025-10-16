// Ready72WireframesV072Patch.tsx — Adds Play Again loop
import React, { useState } from 'react';
import Ready72WireframesV071 from './Ready72WireframesV071';

export default function Ready72WireframesV072Patch(): JSX.Element {
  const [scene, setScene] = useState<0|1|2|3|4|5>(1);
  const [persona, setPersona] = useState<any>(null);
  const [cash, setCash] = useState<number>(0);
  const [cartFinal, setCartFinal] = useState<Record<string, number>>({});
  const [packKg, setPackKg] = useState<number>(0);
  const [packLimitKg, setPackLimitKg] = useState<number>(0);
  const [win, setWin] = useState<boolean>(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  function resetGame(keepPersona = true) {
    setCartFinal({});
    setPackKg(0);
    setPackLimitKg(0);
    setWin(false);
    setEventLog([]);
    setScene(1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  }

  return (
    <Ready72WireframesV071 />
  );
}