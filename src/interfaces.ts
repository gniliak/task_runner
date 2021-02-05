interface ResolveContext {
    checked: Set<string>|Set<unknown>;
}
export { ResolveContext }

interface RunContext {
    cwd: string;
    shell: boolean;
    resources: Set<Deno.Closer>|Set<unknown>;
}
export { RunContext }

interface Command {
    resolveRef(tasks: Tasks, context: ResolveContext): Command;
    run(args: string[], context: RunContext): Promise<void>;
}
export { Command }

type Tasks = { [name: string]: Command };
export { Tasks }

interface RunOptions {
    cwd?: string;
    shell?: boolean;
}
export { RunOptions }