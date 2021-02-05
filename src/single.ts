import { ResolveContext, Tasks, Command, RunContext } from "./interfaces.ts";
import ProcessError from "./process_error.ts";

class Single implements Command {

    constructor(public script: string) {}
    resolveRef(tasks: Tasks, _: ResolveContext) {
        return this;
    }

    /**
     * @description
     * ???
     *
     * @param {string[]} args
     * @param {RunContext}
     */
    public async run(args: string[], { cwd, shell, resources }: RunContext) {
        const allArgs = shell
            ? [...this.getShellCommand(), [this.script, ...args].join(" ")]
            : [...this.script.split(/\s/), ...args];
        const p = Deno.run({
            cmd: allArgs,
            cwd: cwd,
            stdout: "inherit",
            stderr: "inherit"
        });
        const self = this
        const closer = {
            close() {
                self.kill(p);
            }
        };
        resources.add(closer);
        const status = await p.status();
        p.close();
        resources.delete(closer);
        if (!status.success) {
            throw new ProcessError(p.pid, p.rid, status);
        }
    }

    /**
     * @description
     * Kill a running command by process
     *
     * @param {Deno.Process} p
     */
    private async kill(p: Deno.Process) {
        let k
        const OS = Deno.env.get('OS')
        if (OS === "Windows_NT") {
            k = Deno.run({
                cmd: ["taskkill", "/F", "/PID", `${p.pid}`],
                stdout: "inherit",
                stderr: "inherit"
            });
        } else {
            k = Deno.run({
                cmd: ["kill", `${p.pid}`],
                stdout: "inherit",
                stderr: "inherit"
            });
        }
        await k.status();
        k.close();
    }

    /**
     * @description
     * Get command to execute shell script
     *
     * @return {string[]}
     */
    private getShellCommand(): string[] {
        const OS = Deno.env.get('OS');
        if (OS === "Windows_NT") {
            return [Deno.env.get('COMSPEC') || "cmd.exe", "/D", "/C"];
        } else {
            return [Deno.env.get('SHELL') || "/bin/sh", "-c"];
        }
    }
}

export default Single