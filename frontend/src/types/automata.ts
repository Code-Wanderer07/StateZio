export type MachineType = 'DFA' | 'NFA' | 'PDA' | 'TM';

export type PDAMode = 'state' | 'empty_stack';

export type TMDirection = 'L' | 'R' | 'S';

export const EPSILON = 'ε';
export const BLANK = '␣'; // or '_'

export interface AutomataState {
  id: string;
  label: string;
  isInitial: boolean;
  isAccept: boolean;
  x?: number;
  y?: number;
}

export interface BaseTransition {
  id: string;
  from: string;
  to: string;
}

export interface DFATransition extends BaseTransition {
  symbol: string; // e.g. "0" or "a"
}

export interface NFATransition extends BaseTransition {
  symbol: string; // "0", "a", or "ε" / "eps"
}

export interface PDATransition extends BaseTransition {
  inputSymbol: string; // "a", "b", or "ε"
  popSymbol: string;   // "Z0", "a", or "ε"
  pushSymbols: string; // "aZ0", "ε" (pop without push), "aa", etc.
}

export interface TMTransition extends BaseTransition {
  readSymbol: string;  // "0", "1", "␣" / "_"
  writeSymbol: string; // "0", "1", "X", "␣"
  direction: TMDirection; // 'L' | 'R' | 'S'
}

export type AutomataTransition =
  | ({ type: 'DFA' } & DFATransition)
  | ({ type: 'NFA' } & NFATransition)
  | ({ type: 'PDA' } & PDATransition)
  | ({ type: 'TM' } & TMTransition);

export interface DFAMachine {
  type: 'DFA';
  name: string;
  description?: string;
  alphabet: string[];
  states: AutomataState[];
  startState: string;
  acceptStates: string[];
  transitions: DFATransition[];
}

export interface NFAMachine {
  type: 'NFA';
  name: string;
  description?: string;
  alphabet: string[];
  states: AutomataState[];
  startState: string;
  acceptStates: string[];
  transitions: NFATransition[];
}

export interface PDAMachine {
  type: 'PDA';
  name: string;
  description?: string;
  inputAlphabet: string[];
  stackAlphabet: string[];
  initialStackSymbol: string; // default "Z0"
  acceptanceMode: PDAMode;
  states: AutomataState[];
  startState: string;
  acceptStates: string[];
  transitions: PDATransition[];
}

export interface TMMachine {
  type: 'TM';
  name: string;
  description?: string;
  inputAlphabet: string[];
  tapeAlphabet: string[];
  blankSymbol: string; // default "␣" or "_"
  states: AutomataState[];
  startState: string;
  acceptStates: string[];
  rejectStates: string[];
  transitions: TMTransition[];
}

export type AutomataMachine = DFAMachine | NFAMachine | PDAMachine | TMMachine;

export type SimulationStatus = 'IDLE' | 'RUNNING' | 'ACCEPTED' | 'REJECTED' | 'HALTED_ACCEPT' | 'HALTED_REJECT' | 'ERROR';

export interface SimulationStepTrace {
  stepIndex: number;
  activeStates: string[]; // Node IDs currently active
  currentSymbol?: string;
  inputIndex: number;     // Index in input string being processed
  remainingInput: string;
  // PDA specific
  stack?: string[];       // Bottom to Top array
  topOfStack?: string;
  // TM specific
  tape?: string[];        // Array of tape characters
  headIndex?: number;     // Index of head in tape array
  tapeOffset?: number;    // Virtual offset
  // Diagnostics
  activeTransitionId?: string;
  actionSummary: string;
  status: SimulationStatus;
}

export interface SimulationResult {
  accepted: boolean;
  finalStatus: SimulationStatus;
  traces: SimulationStepTrace[];
  totalSteps: number;
  executionTimeMs?: number;
  message?: string;
}

export interface BatchTestCase {
  id: string;
  input: string;
  expected: boolean;
  actual?: boolean;
  status?: 'PASS' | 'FAIL' | 'PENDING';
  totalSteps?: number;
}

export interface SubsetRow {
  dfaStateName: string;
  nfaStateSet: string[]; // sorted list of NFA state IDs
  isInitial: boolean;
  isAccept: boolean;
  transitions: Record<string, { targetName: string; targetSet: string[] }>;
}

export interface SubsetConstructionResult {
  convertedDfa: DFAMachine;
  table: SubsetRow[];
  stepsExplanation: string[];
}

export interface PresetAutomata {
  id: string;
  name: string;
  module: 'Module 1' | 'Module 3' | 'Module 4';
  type: MachineType;
  description: string;
  machine: AutomataMachine;
  testCases: { input: string; expected: boolean }[];
}

export type QuestionCategory = 'DFA' | 'NFA' | 'PDA' | 'TM' | 'GENERAL';

export interface QuestionBankItem {
  id: string;
  title: string;
  category: QuestionCategory;
  module: 'Module 1' | 'Module 3' | 'Module 4';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  hint?: string;
  sampleInputs: string[];
}

export interface FormalTuples {
  states: string[];
  alphabet: string[];
  startState: string;
  acceptStates: string[];
  stackAlphabet?: string[];
  initialStack?: string;
  tapeAlphabet?: string[];
  blankSymbol?: string;
  transitionTable: {
    from: string;
    read: string;
    to: string;
    popOrWrite?: string;
    pushOrMove?: string;
  }[];
}

export interface StateMeaning {
  stateId: string;
  label: string;
  meaning: string;
}

export interface SolvedQuestionResult {
  id: string;
  question: string;
  title: string;
  machineType: MachineType;
  module: 'Module 1' | 'Module 3' | 'Module 4';
  languageDescription: string;
  formalDefinition: string; // e.g. "L = { w ∈ {0,1}* | w ends in '01' }"
  regularExpressionOrGrammar?: string;
  formalTuples: FormalTuples;
  stateMeanings: StateMeaning[];
  constructionSteps: string[];
  machine: AutomataMachine;
  testCases: { input: string; expected: boolean; reason: string }[];
  confidenceScore: number;
}
