import { Tasks, RunOptions, Command } from "./interfaces.ts"
import Parallel from "./parallel.ts";
import Sequence from "./sequence.ts";
import Ref from "./ref.ts";
import Single from "./single.ts";

export class TaskRunner {

    /**
     * @var {Tasks} tasks List of tasks registered
     */
    private tasks: Tasks = {};

    /**
     * @description
     * Registers tasks
     *
     * @param {string} name Name of the task
     * @param {string|string[]} rawCommands
     *
     * @example
     * task('my-task-name', 'echo hello', 'echo goodbye')
     *
     * @return {void}
     */
    public task(name: string, ...rawCommands: (string | string[])[]): void {
        if (name.split(/\s/).length > 1) {
            throw new Error(`Task name "${name}" is invalid.`);
        }
        if (this.tasks[name]) {
            throw new Error(`Task name "${name}" is duplicated.`);
        }
        this.tasks[name] = TaskRunner.makeCommand(rawCommands);
    }

    /**
     * @description
     * Runs a task by its task name
     *
     * @param {string} taskName
     * @param {???} args ???
     * @param {RunOptions} options
     *
     * @example
     * ???
     */
    public async run(taskName: string, args: string[] = [], options: RunOptions = {}): Promise<void> {
        const newOptions = { cwd: ".", shell: true, ...options };
        const command = this.tasks[taskName];
        if (!command) {
            throw new Error(`Task "${taskName}" not found.`);
        }
        const resolveContext = { checked: new Set() };
        const context = {
            cwd: newOptions.cwd,
            shell: newOptions.shell,
            resources: new Set()
        };
        const resolvedCommand = command.resolveRef(this.tasks, resolveContext);
        await resolvedCommand.run(args, context);
    }

    private static makeCommand(rawCommands: (string | string[])[]): Command {
        if (rawCommands.length === 0) {
            throw new Error("Task needs at least one command.");
        }
        if (rawCommands.length === 1) {
            return TaskRunner.makeNonSequenceCommand(rawCommands[0]);
        }
        return new Sequence(rawCommands.map(TaskRunner.makeNonSequenceCommand));
    }

    private static makeNonSequenceCommand(rawCommand: string | string[]): Command {
        if (typeof rawCommand === "string") {
            return TaskRunner.makeSingleCommand(rawCommand);
        }
        return new Parallel(rawCommand.map(TaskRunner.makeSingleCommand));
    }

    private static makeSingleCommand(script: string) {
        script = script.trim();
        if (!script.trim()) {
            throw new Error("Command should not be empty.");
        }
        if (script.charAt(0) === "$") {
            return new Ref(script);
        }

        return new Single(script);
    }
}