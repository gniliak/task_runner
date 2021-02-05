interface ResolveContext {
    checked: Set<string>|Set<unknown>;
}
export type { ResolveContext }

interface RunContext {
    cwd: string;
    shell: boolean;
    resources: Set<Deno.Closer>|Set<unknown>;
}
export type { RunContext }

interface Command {
    resolveRef(tasks: Tasks, context: ResolveContext): Command;
    run(args: string[], context: RunContext): Promise<void>;
}
export type { Command }

type Tasks = { [name: string]: Command };
export type { Tasks }

interface RunOptions {
    cwd?: string;
    shell?: boolean;
}
export type { RunOptions }