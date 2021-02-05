import { ResolveContext, Tasks, Command, RunContext } from "./interfaces.ts";

class Parallel implements Command {

    private commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    resolveRef(tasks: Tasks, context: ResolveContext) {
        return new Parallel(
            this.commands.map(c => {
                return c.resolveRef(tasks, context);
            })
        );
    }

    async run(args: string[], context: RunContext) {
        if (args.length) {
            throw new Error("Cannot pass args to parallel tasks.");
        }
        await Promise.all(this.commands.map(c => c.run([], context)));
    }
}

export default Parallel