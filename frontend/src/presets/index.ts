import { dfaPresets } from './dfaPresets';
import { nfaPresets } from './nfaPresets';
import { pdaPresets } from './pdaPresets';
import { tmPresets } from './tmPresets';
import { PresetAutomata } from '../types/automata';

export const allPresets: PresetAutomata[] = [
  ...dfaPresets,
  ...nfaPresets,
  ...pdaPresets,
  ...tmPresets,
];

export { dfaPresets, nfaPresets, pdaPresets, tmPresets };
