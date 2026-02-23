import { RuleBasedProvider } from "./ruleBasedProvider";
import { OllamaProvider } from "./ollamaProvider";
import type { RewriteProvider } from "./types";

export const ruleBasedProvider = new RuleBasedProvider();
export const ollamaProvider = new OllamaProvider();

export const getRewriteProvider = (mode: 'rule' | 'ollama'): RewriteProvider => {
    return mode === 'ollama' ? ollamaProvider : ruleBasedProvider;
};
