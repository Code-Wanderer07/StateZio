import {
  AutomataMachine,
  NFAMachine,
  SimulationResult,
  SubsetConstructionResult,
} from '../types/automata';

export const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function remoteSimulate(
  machine: AutomataMachine,
  inputStr: string
): Promise<SimulationResult> {
  const typeEndpoint = machine.type.toLowerCase();
  const res = await fetch(
    `${API_BASE_URL}/api/simulate/${typeEndpoint}?input_str=${encodeURIComponent(
      inputStr
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machine),
    }
  );

  if (!res.ok) {
    throw new Error(`Backend simulation error: ${res.statusText}`);
  }

  return res.json();
}

export async function remoteConvertNFAToDFA(
  nfa: NFAMachine
): Promise<SubsetConstructionResult> {
  const res = await fetch(`${API_BASE_URL}/api/convert/nfa-to-dfa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nfa),
  });

  if (!res.ok) {
    throw new Error(`Backend conversion error: ${res.statusText}`);
  }

  return res.json();
}

export async function remoteSolveQuestion(prompt: string): Promise<unknown> {
  const res = await fetch(
    `${API_BASE_URL}/api/solve-question?prompt=${encodeURIComponent(prompt)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!res.ok) {
    throw new Error(`Backend question solve error: ${res.statusText}`);
  }

  return res.json();
}
