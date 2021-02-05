import { ResolveContext, Tasks, Command, RunContext } from "./interfaces.ts";
import Single from "./single.ts";

class Ref implements Command {

    constructor(public script: string) {}

    resolveRef(tasks: Tasks, context: ResolveContext) {
        const splitted = this.script.split(/\s/);
        const name = splitted[0].slice(1);
        const args = splitted.slice(1);
        if (!name.length) {
            throw new Error("Task name should not be empty.");
        }

        let command = tasks[name];
        if (!command) {
            throw new Error(`Task "${name}" is not defined.`);
        }
        if (context.checked.has(name)) {
            throw new Error(`Task "${name}" is in a reference loop.`);
        }
        if (command instanceof Single) {
            command = new Single([command.script, ...args].join(" "));
        }
        return command.resolveRef(tasks, {
            ...context,
            checked: new Set(context.checked).add(name)
        });
    }

    async run(args: string[], context: RunContext) {
        throw new Error("Ref should be resolved before running.");
    }
}

export default Ref