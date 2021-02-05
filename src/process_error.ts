/**
 * @class ProcessError
 *
 * @extends Error
 *
 * @description
 * Custom error class, that acts as a layer so we can customise thrown errors better
 *
 * @throws Error
 *
 * @example
 * const p = await Deno.run({ ... })
 * if (p fails) {
 *     throw new ProcessError(p.pid, p.pid, await p.status(), taskname)
 * }
 */
class ProcessError extends Error {
    constructor(
        public pid: number,
        public rid: number,
        public status: Deno.ProcessStatus,
        public taskName?: string
    ) {
        super("Process exited with status code " + status.code);
    }
}

export default ProcessError