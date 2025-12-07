/**
 * Script Generator Prompts - Optimized Pipeline (5 Steps)
 * 
 * Pipeline Flow:
 * 1. Strategy & Structure - Creates video blueprint
 * 2. Introduction - Writes hook and intro (0-2 min)
 * 3. Development - Writes main body content
 * 4. Complete Script - Adds Product CTA + Sponsor CTA + Conclusion (MERGED STEP)
 * 5. SSML Formatting - Formats for ElevenLabs TTS
 * 
 * Post-Processing:
 * - Audit: Validates script for issues
 * - Fix: Auto-corrects if validation fails
 */

export { getStep1Prompt } from './step1-strategy';
export { getStep2Prompt } from './step2-introduction';
export { getStep3Prompt } from './step3-development';
export { getStep4Prompt } from './step4-complete-script';
export { getStep5Prompt } from './step5-ssml-formatting';
export { getAuditPrompt, getPromptFix } from './audit-fix';
