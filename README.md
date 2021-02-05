# task_runner

Clone from https://deno.land/x/task_runner_v2@v1.0.3

```
// tasks.ts
import { task } from "https://denopkg.com/gniliak/task_runner/mod.ts";

// A task is defined like so:
// task('say-hello', 'echo hello', 'echo world', ...)
//        ^^^^^^^      ^^^^^^        ^^^^^^^^
//       task name    1st task       2nd task

// To call tasks from another task, we use their name and prefix it with "$":
// task('run-say-hello', '$say-hello')

// Create our real tasks
task("prepare", "echo preparing...");
task("say-hello", "echo hello");
task("all", "$prepare", "$say-hello");

```

Run the sample by:

```
$ deno --allow-env --allow-run tasks.ts all
preparing...
hello

```