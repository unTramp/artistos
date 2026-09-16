import type { ZodType } from "zod";
export interface AIRequest<T> { workflow:string; input:unknown; outputSchema:ZodType<T>; traceId:string; }
export interface AIResult<T> { output:T; provider:string; model:string; latencyMs:number; inputTokens?:number; outputTokens?:number; cost?:number; }
export interface AIProvider { runStructured<T>(request:AIRequest<T>):Promise<AIResult<T>>; }
export class AIDisabledError extends Error { constructor(){ super("AI provider is disabled"); this.name="AIDisabledError"; } }
export class DisabledAIProvider implements AIProvider { async runStructured<T>(_request:AIRequest<T>):Promise<AIResult<T>> { throw new AIDisabledError(); } }
