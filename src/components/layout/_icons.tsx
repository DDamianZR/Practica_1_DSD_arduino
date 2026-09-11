import {
  Cpu as LucCpu,
  Table2 as LucTable2,
  GitBranch as LucGitBranch,
  Activity,
} from "lucide-react";

export const Cpu = LucCpu;
export const Table2 = LucTable2;
export const GitBranch = LucGitBranch;
// Alias local para el nombre "Waveform" (lucide-react no expone Waveform en
// todas las versiones estables; Activity encaja graficamente).
export const Waveform = Activity;
