import { ResolveContext, Tasks, Command, RunContext } from "./interfaces.ts";

class Sequence implements Command {

    private readonly commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    resolveRef(tasks: Tasks, context: ResolveContext) {
        return new Sequence(
            this.commands.map(c => {
                return c.resolveRef(tasks, context);
            })
        );
    }

    async run(args: string[], context: RunContext) {
        if (args.length) {
            throw new Error("Cannot pass args to sequential tasks.");
        }
        for (let command of this.commands) {
            await command.run([], context);
        }
    }
}

export default Sequence