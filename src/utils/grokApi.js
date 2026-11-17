/**
 * Backwards compatibility proxy: maps grokApi to groqApi.
 */
export * from './groqApi';
export { tailorResumeWithGroq as tailorResumeWithGrok } from './groqApi';
export { getDefaultGroqApiKey as getDefaultGrokApiKey } from './groqApi';
