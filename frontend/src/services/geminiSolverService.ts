import {
  SolvedQuestionResult,
  DFAMachine,
  NFAMachine,
  PDAMachine,
  TMMachine,
  AutomataMachine,
  MachineType,
} from '../types/automata';
import { simulateDFA } from '../engine/dfaEngine';
import { simulateNFA } from '../engine/nfaEngine';
import { simulatePDA } from '../engine/pdaEngine';
import { simulateTM } from '../engine/tmEngine';

const GEMINI_STORAGE_KEY = 'statezio_gemini_api_key';

export function getStoredGeminiApiKey(): string {
  const localKey = localStorage.getItem(GEMINI_STORAGE_KEY) || '';
  if (localKey.trim()) return localKey.trim();
  const envKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
  return envKey.trim();
}

export function saveStoredGeminiApiKey(key: string): void {
  localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
}

export function clearStoredGeminiApiKey(): void {
  localStorage.removeItem(GEMINI_STORAGE_KEY);
}

const SYSTEM_INSTRUCTION = `You are a World-Class Professor of Automata Theory and Formal Languages (TOC).
Given a user's question or problem statement, synthesize a formally rigorous, complete, and mathematically exact state machine (DFA, NFA, PDA, or TM).

CRITICAL REQUIREMENTS:
1. Determine the correct machine type: "DFA", "NFA", "PDA", or "TM".
2. If it is a DFA:
   - It MUST be deterministic (every state has exactly ONE transition for every alphabet symbol).
   - Use a trap/dead state (e.g., "q_trap") when inputs must be rejected permanently (e.g. for prefix mismatches).
3. States must have clean IDs: "q0", "q1", "q2", etc. The startState is usually "q0".
4. Provide stateMeanings: what invariant each state represents.
5. Provide 4-6 testCases with realistic inputs, their boolean expected result (true if accepted, false if rejected), and short reason.
6. Provide formalTuples including states, alphabet, startState, acceptStates, and transitionTable.

Return ONLY valid JSON matching this exact structure:
{
  "id": "gemini_generated_id",
  "title": "Short descriptive title",
  "question": "The question being solved",
  "machineType": "DFA" | "NFA" | "PDA" | "TM",
  "module": "Module 1" | "Module 3" | "Module 4",
  "languageDescription": "Formal set builder notation for the language L",
  "formalDefinition": "Mathematical definition of L",
  "regularExpressionOrGrammar": "Regex or CFG if applicable",
  "formalTuples": {
    "states": ["q0", "q1"],
    "alphabet": ["0", "1"],
    "startState": "q0",
    "acceptStates": ["q1"],
    "transitionTable": [
      { "from": "q0", "read": "0", "to": "q0" },
      { "from": "q0", "read": "1", "to": "q1" }
    ]
  },
  "stateMeanings": [
    { "stateId": "q0", "label": "q0", "meaning": "Initial state description" }
  ],
  "constructionSteps": [
    "Step 1: Description",
    "Step 2: Description"
  ],
  "machine": {
    "type": "DFA" | "NFA" | "PDA" | "TM",
    "name": "Machine Name",
    "description": "Short explanation",
    "alphabet": ["0", "1"],
    "inputAlphabet": ["0", "1"],
    "stackAlphabet": ["a", "Z0"],
    "initialStackSymbol": "Z0",
    "acceptanceMode": "state",
    "tapeAlphabet": ["0", "1", "_"],
    "blankSymbol": "_",
    "states": [
      { "id": "q0", "label": "q0", "isInitial": true, "isAccept": false, "x": 100, "y": 200 },
      { "id": "q1", "label": "q1", "isInitial": false, "isAccept": true, "x": 300, "y": 200 }
    ],
    "startState": "q0",
    "acceptStates": ["q1"],
    "rejectStates": ["q_trap"],
    "transitions": []
  },
  "testCases": [
    { "input": "01", "expected": true, "reason": "Matches definition" },
    { "input": "00", "expected": false, "reason": "Does not match" }
  ],
  "confidenceScore": 0.95
}`;

export async function solveQuestionWithGemini(
  prompt: string,
  apiKey?: string
): Promise<SolvedQuestionResult> {
  const key = apiKey || getStoredGeminiApiKey();
  if (!key) {
    throw new Error(
      'Google Gemini API Key not found. Please provide an API key to use the AI Question Solver.'
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Problem: ${prompt}\n\nPlease generate the complete, formally verified Automata solution matching the JSON specification.`,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const msg = errorJson?.error?.message || `Gemini API responded with status ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No solution returned from Gemini AI model.');
  }

  let parsed: SolvedQuestionResult;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', rawText, err);
    throw new Error('Gemini AI returned a malformed response. Please try again.');
  }

  // Sanitize and locally verify the generated automata
  return sanitizeAndVerifyAutomata(parsed, prompt);
}

function sanitizeAndVerifyAutomata(
  raw: SolvedQuestionResult,
  originalPrompt: string
): SolvedQuestionResult {
  const mType: MachineType = raw.machineType || (raw.machine?.type as MachineType) || 'DFA';
  const rawMachine = raw.machine || ({} as AutomataMachine);

  // Auto-generate positions for states if missing or overlapping
  const states = (rawMachine.states || []).map((s, idx) => ({
    id: s.id || `q${idx}`,
    label: s.label || s.id || `q${idx}`,
    isInitial: s.isInitial ?? idx === 0,
    isAccept: s.isAccept ?? (rawMachine.acceptStates || []).includes(s.id),
    x: s.x && s.x > 0 ? s.x : 100 + (idx % 4) * 180,
    y: s.y && s.y > 0 ? s.y : 180 + Math.floor(idx / 4) * 160,
  }));

  const startState = rawMachine.startState || states.find((s) => s.isInitial)?.id || 'q0';
  const acceptStates = rawMachine.acceptStates || states.filter((s) => s.isAccept).map((s) => s.id);

  // Normalize transitions by machine type
  let sanitizedTransitions: unknown[] = [];
  if (mType === 'DFA') {
    sanitizedTransitions = ((rawMachine as DFAMachine).transitions || []).map((t, i) => ({
      id: t.id || `t_dfa_${i}`,
      from: t.from || 'q0',
      to: t.to || 'q0',
      symbol: t.symbol || '0',
    }));
  } else if (mType === 'NFA') {
    sanitizedTransitions = ((rawMachine as NFAMachine).transitions || []).map((t, i) => ({
      id: t.id || `t_nfa_${i}`,
      from: t.from || 'q0',
      to: t.to || 'q0',
      symbol: t.symbol || 'ε',
    }));
  } else if (mType === 'PDA') {
    sanitizedTransitions = ((rawMachine as PDAMachine).transitions || []).map((t, i) => ({
      id: t.id || `t_pda_${i}`,
      from: t.from || 'q0',
      to: t.to || 'q0',
      inputSymbol: t.inputSymbol || 'ε',
      popSymbol: t.popSymbol || 'Z0',
      pushSymbols: t.pushSymbols || 'Z0',
    }));
  } else {
    sanitizedTransitions = ((rawMachine as TMMachine).transitions || []).map((t, i) => ({
      id: t.id || `t_tm_${i}`,
      from: t.from || 'q0',
      to: t.to || 'q0',
      readSymbol: t.readSymbol || '_',
      writeSymbol: t.writeSymbol || '_',
      direction: t.direction || 'R',
    }));
  }

  let sanitizedMachine: AutomataMachine;
  if (mType === 'DFA') {
    sanitizedMachine = {
      type: 'DFA',
      name: rawMachine.name || `DFA: AI Solution`,
      description: rawMachine.description || `Synthesized for: ${originalPrompt}`,
      alphabet: (rawMachine as DFAMachine).alphabet || ['0', '1'],
      states,
      startState,
      acceptStates,
      transitions: sanitizedTransitions as DFAMachine['transitions'],
    };
  } else if (mType === 'NFA') {
    sanitizedMachine = {
      type: 'NFA',
      name: rawMachine.name || `NFA: AI Solution`,
      description: rawMachine.description || `Synthesized for: ${originalPrompt}`,
      alphabet: (rawMachine as NFAMachine).alphabet || ['0', '1'],
      states,
      startState,
      acceptStates,
      transitions: sanitizedTransitions as NFAMachine['transitions'],
    };
  } else if (mType === 'PDA') {
    sanitizedMachine = {
      type: 'PDA',
      name: rawMachine.name || `PDA: AI Solution`,
      description: rawMachine.description || `Synthesized for: ${originalPrompt}`,
      inputAlphabet: (rawMachine as PDAMachine).inputAlphabet || ['a', 'b'],
      stackAlphabet: (rawMachine as PDAMachine).stackAlphabet || ['a', 'Z0'],
      initialStackSymbol: (rawMachine as PDAMachine).initialStackSymbol || 'Z0',
      acceptanceMode: (rawMachine as PDAMachine).acceptanceMode || 'state',
      states,
      startState,
      acceptStates,
      transitions: sanitizedTransitions as PDAMachine['transitions'],
    };
  } else {
    sanitizedMachine = {
      type: 'TM',
      name: rawMachine.name || `TM: AI Solution`,
      description: rawMachine.description || `Synthesized for: ${originalPrompt}`,
      inputAlphabet: (rawMachine as TMMachine).inputAlphabet || ['0', '1'],
      tapeAlphabet: (rawMachine as TMMachine).tapeAlphabet || ['0', '1', '_'],
      blankSymbol: (rawMachine as TMMachine).blankSymbol || '_',
      states,
      startState,
      acceptStates,
      rejectStates: (rawMachine as TMMachine).rejectStates || [],
      transitions: sanitizedTransitions as TMMachine['transitions'],
    };
  }

  // Run local simulation against test cases to verify accuracy
  const testCases = raw.testCases || [];
  let passedTests = 0;
  for (const tc of testCases) {
    try {
      let simResult;
      if (mType === 'DFA') {
        simResult = simulateDFA(sanitizedMachine as DFAMachine, tc.input);
      } else if (mType === 'NFA') {
        simResult = simulateNFA(sanitizedMachine as NFAMachine, tc.input);
      } else if (mType === 'PDA') {
        simResult = simulatePDA(sanitizedMachine as PDAMachine, tc.input);
      } else {
        simResult = simulateTM(sanitizedMachine as TMMachine, tc.input);
      }

      if (simResult.accepted === tc.expected) {
        passedTests++;
      }
    } catch {
      // Simulation test exception
    }
  }

  const passRate = testCases.length > 0 ? passedTests / testCases.length : 1;

  return {
    id: raw.id || `gemini_${Date.now()}`,
    question: raw.question || originalPrompt,
    title: raw.title || `${mType}: ${originalPrompt.slice(0, 40)}`,
    machineType: mType,
    module: raw.module || (mType === 'PDA' ? 'Module 3' : mType === 'TM' ? 'Module 4' : 'Module 1'),
    languageDescription: raw.languageDescription || `L for ${originalPrompt}`,
    formalDefinition: raw.formalDefinition || `Formal specification for ${mType}`,
    regularExpressionOrGrammar: raw.regularExpressionOrGrammar,
    formalTuples: raw.formalTuples || {
      states: states.map((s) => s.id),
      alphabet: (rawMachine as DFAMachine).alphabet || ['0', '1'],
      startState,
      acceptStates,
      transitionTable: [],
    },
    stateMeanings: raw.stateMeanings || states.map((s) => ({ stateId: s.id, label: s.label, meaning: s.label })),
    constructionSteps: raw.constructionSteps || [
      '1. Constructed formal transition graph with states and accept conditions.',
      '2. Verified transitions using local simulation engine.',
    ],
    machine: sanitizedMachine,
    testCases,
    confidenceScore: Math.round(passRate * 100) / 100,
  };
}
