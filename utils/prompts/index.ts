/**
 * Centralized Prompts Index
 * Re-exports all prompts from modular structure
 */

// Script Generator (Optimized 4-Step Pipeline + Optional Post-Processing)
export {
    getStep1Prompt,
    getStep2Prompt,
    getStep3Prompt,
    getStep4Prompt,
    getSSMLFormattingPrompt,
    getDanielCunhaStylePrompt,
    getPromptFix
} from './script-generator';

// Niche Analyzer
export * from './niche-analyzer';

// Theme Creator
export * from './theme-creator';

// Title & Description
export * from './title-description';

// B-Roll Creator
export * from './broll-creator';

// Thumbnail Planner  
export * from './thumbnail';
