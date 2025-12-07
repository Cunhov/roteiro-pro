/**
 * Script Generator Prompts - Optimized Pipeline (4 Steps + Optional Post-Processing)
 * 
 * Pipeline Flow:
 * 1. Strategy & Structure - Creates video blueprint
 * 2. Introduction - Writes hook and intro (0-2 min)
 * 3. Development - Writes main body content
 * 4. Complete Script - Adds Product CTA + Sponsor CTA + Conclusion (MERGED STEP)
 * 
 * Optional Post-Processing (buttons after Step 4):
 * - Daniel Cunha Style: Transforms script to characteristic masculine/direct tone
 * - SSML Formatting: Formats for ElevenLabs TTS (was automatic Step 5, now optional)
 * - Audit: Validates script for issues (runs automatically if errors detected)
 */

export { getStep1Prompt } from './step1-strategy';
export { getStep2Prompt } from './step2-introduction';
export { getStep3Prompt } from './step3-development';
export { getStep4Prompt } from './step4-complete-script';
export { getSSMLFormattingPrompt } from './step5-ssml-formatting';
export { getDanielCunhaStylePrompt } from './style-daniel-cunha';
export { getAuditPrompt, getPromptFix } from './audit-fix';
