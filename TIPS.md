<!-- 32 Tricks to Level Up Claude Code in 16 Mins -->
<!-- https://www.youtube.com/watch?v=jqoFP9QapXI -->
<!-- Nate Herk | AI Automation -->

# Cloud Code Hacks for AI Development

## Intro

These are the cloud code hacks that took me from a complete beginner to mass-producing workflows and building websites, apps, and AI agents in real time.

Today, we are going to go from beginner hacks all the way to advanced power user stuff. The best ones are saved at the end.

Starting off with our beginner hacks, let's dive in.

## Beginner Hacks

Number one is to run `/init` on every project. If you have an existing project with files already in it, the first thing you should do is open it and type `/init`.

Cloud Code will then scan your entire codebase—your folders, your files—and it will generate a `cloud.md` file. This file is basically a cheat sheet for that project. It maps out your architecture, your conventions, and any key files you have in there.

Instead of having to re-explain your project every session, Cloud will contextualize and initialize everything, knowing exactly what you are working with.

If you are starting a new project from scratch, you can have Cloud Code help you create that `cloud.md` file yourself just by explaining the project's goal, what tech stack you want to use, or any specific rules or key folders and files.

Number two is to set up a status line. If you are working in the terminal, you can type `/status line` and tell Cloud Code what you want to see: your model, your context percentage, cost, and so on. It generates a little script that sits at the bottom of the terminal.

As you talk every single time, you can see that status line. It acts like a mini dashboard for your session. It is really helpful to always be able to see how much context you have left so you can avoid context rot.

Hack number three is using voice input. Cloud Code just shipped a native `/voice` command, which means you can literally talk to your terminal and have it code for you now. It is still rolling out and will be available for everyone soon.

Another good hack is to use an app to actually be able to voice dictate anywhere. If you want to see the tool I use, you can check out the description. Now, I can just talk, and words will appear anywhere.

Hack number four is to keep your context small. Do not dump your entire codebase into a conversation. Only give Claude what it needs for the current task. Try to break big problems into small, focused steps. The less noise in the context window, the better Claude performs. It is simple, but a lot of people ignore this.

Hack number five is to use `/context` to find your token bloat. If you run `/context`, you will see exactly what is eating your tokens, whether that is system prompts, file contents, or MCP servers. All of that gets broken down into percentages. If your session feels a little bloated, you can actually investigate it, diagnose where the problem is, and then restructure.

Hack number six is to use `/compact` and also clear between tasks. When your context hits around 60%, type `/compact`. Cloud Code will compress your conversation history so you can keep going without losing important stuff.

Something interesting is that you can run `/compact`, but you can tell it to keep certain things, like, "Slash compact, but keep all of the API integration decisions and database schema." Claude will automatically shrink everything down and preserve the stuff you need to keep.

If you are going to switch to a completely different task and you don't need that conversation history, then use `/clear` to just wipe the slate clean, and you are starting from a new conversation. Luckily, you still have your `cloud.md`. You still have all the other files, so it is not like you are actually starting from scratch.

Hack number seven is to always start in plan mode. This means you can hit Shift+Tab to cycle between modes or just choose it manually. Once Claude is in plan mode, it can still read and research, but it won't actually change anything. Claude will outline the steps, ask clarifying questions, and map out the approach before writing a single line of code, which has been shown to improve the quality.

Once you like the plan, you switch out of plan mode and tell it to execute. This alone will dramatically reduce how many times you have to go back and correct Claude.

Hack number eight is to treat Claude like a junior developer. This means don't always give it direct commands like, "Write me a function that does X," but try to understand how you can give it problems. Saying, "How should we handle growth tracking?" and letting it think through the approach is better. When it makes its own assumptions and thinks through decisions, you can ask it to explain those. This has also been shown to get better outputs when Claude reasons through the problem first. It is like plan mode, but now you are having it think a little bit deeper.

Hack number nine is to make Claude ask questions. A lot of times in plan mode, it will do this natively, but you can actually tell it to invoke its "ask user question" tool. You can tell it to continuously ask, "Me questions until you're 95% confident that you understand exactly what I need and exactly what you need to do." This alignment helps you avoid having to go back and forth with three or four rounds of revisions.

All right, hack number 10 is to build self-checking into the to-do lists. You know how Cloud makes a to-do list when it starts building? Well, you can actually build verification steps right into that list.

For example, one to-do might be to build the website. The very next to-do could be to take a screenshot of the website and check that everything looks right. Then maybe the next step is to open Chrome DevTools to use the browser and make sure that there are no actual errors in functionality. You are now baking quality checks directly into the execution plan.

Claude isn't just building stuff and handing it to you for feedback; it's building something, checking it, making sure everything is good, and then getting your feedback.

Another cool thing I like to do here is say, "Don't move on to your next to-do until you're 95% confident that that to-do is good." Because it's AI, it is really hard to one-shot what you are looking for, but you'd rather have it one-shot 90% of the way there than one-shot 60 or 65%.

Those were our beginner hacks. Now, let's step it up a little bit. These next ones are for the people who are already kind of using Cloud Code a little bit and want to move faster.

## Intermediate Hacks

All right, hack number 11 is to deploy sub-agents for parallel work. Try telling the main session to use sub-agents in your prompt when you are working on complex problems.

Cloud will spin up isolated sub-agents that each have their own context window. They can each be using their own model, and each agent works in parallel. This means the main thread stays clean while the sub-agents go do research, write tests, or explore different approaches. When they are done, they all report back to that main agent with their findings. It is like having a team of developers instead of just having one.

You can even pair this with the model hack for cheaper tokens, which means you can have all the sub-agents running on Haiku for simpler stuff, and your main thread can stay on Opus.

Hack number 12 is to build custom skills. This means you can create reusable prompt files in your `do.cloud/skills` directory. For example, you can have one skill called `techdebt.md` which tells Claude exactly how to scan for technical debt. Or you can have one called `code review.md` which knows exactly how to review your codebase.

All you have to do is invoke that skill in natural language or just use the slash command directly, and it will run that entire workflow consistently every single time. You can even commit them to GitHub, and your whole team can instantly use them as well. You can automate your actual SOPs.

Hack number 13 is something that I alluded to a little bit earlier, but that is basically just using Haiku for sub-agents. You can set the model for the sub-agents that you spin up. When you have simple tasks or processing a large amount of data, then use Haiku. It is way cheaper and it still gets the job done.

Specifically, if you need a sub-agent to go scrape a ton of different articles, read hundreds of thousands of tokens, and then just give Opus, give your main agent just a small summary or the key highlights, it just doesn't really make sense to have such a heavy and expensive model reading hundreds of thousands of tokens if it just needs a few bits of information. If you do this right, it can really keep your cost down without sacrificing quality where it matters.

All right, hack number 14 is to constantly be refreshing your `cloud.md` file. Once there is a new discovery about your project, update the `cloud.md`. Once you have made some new skills, update the `cloud.md`. You want Claude to be logging new patterns, new gotchas, and any new conventions that it discovered during your session. So next time that you start it up, it already knows all of this. This will help prevent repeat mistakes, and it will make Claude smarter about you, your business, your project, all that kind of stuff over time.

But here is the catch: you don't want to let it bloat because the `cloud.md` file is basically the system prompt, and it gets loaded into every single conversation, and everything in there is going to eat up your context window. I try to keep mine simple and only put the most important information in there. I like to keep it between 150 and 200 lines max. If it starts getting longer than that, then it is time to trim down some things.

Which leads perfectly into the next hack, number 15, which is to have `cloud.md` route to other files. Because it potentially eats so many tokens, you want to keep it lean, but you do have a lot of information in there. What is cool is you can route it to different places. You can have it link out to separate files for stuff like style guides, business context, or reference docs. Just point to those files in the `cloud.md` so Claude knows exactly where to look, and then you are also not wasting tokens on information that it doesn't always need because in its system prompt, it doesn't need to know the exact status of a certain project, but it does need to know exactly where to go look to find that information.

Hack number 16 is to exit early and reask. If you notice that Cloud starts going down the wrong path, don't just wait for it to finish. Hit Escape, correct course, and then re-prompt. Every token that it spends going the wrong direction is just wasted context. So steer tight and steer early. At the end of the day, it is AI.

Hack number 17 is to challenge outputs aggressively. If Claude gives you something that is just okay, push back. Say, "Scrap that. Do a more elegant version." Or, "This isn't good enough, try again with a completely different approach." Claude will often give you a dramatically better output on the second try when you set a higher bar, and now it knows what not to do. The key is once it comes back with something better, tell it to update itself, whether that be the skill or the `cloud.md`, so it doesn't make that sort of mistake again.

Hack number 18 is to use `/re` for quick undos. If you make a wrong turn, just try using `/re`, and Claude will roll back to a previous point in the conversation without you having to start over. It is super quick, super clean.

Hack number 19 is using hooks for notifications. If you type `/hooks`, you can set up a notification hook, or you can just have Claude code do this for you in completely natural language. For example, what I like to do is when I have Claude finish up a session or finish a chat, it sends me an actual noise notification because now I can work on something else on my computer, or I can literally have 15 different sessions of Cloud Code running, and if I hear that noise, I know that one of them is done and needs some more input from me.

Hack number 20 is using screenshots. Just remember that Claude can actually see, and this is a huge unlock. This means you can feed it error messages, which means you can feed it, you know, inspiration websites. You can also do a really cool self-check loop where you can say things like, "Take a screenshot of the website and tell me if the layout looks right." It will literally screenshot it, analyze it visually, and tell you what is off.

If you remember one of the hacks from earlier where I said to have it check itself when I was building websites, I basically have it design the website, screenshot, and then implement new changes, and then do that again. It does like three passes of building and screenshots before it even gives me V1. In that flow, the V1 that it gives me is so much better than a V1 that it used to give me.

Hack number 21 is to use Chrome DevTools. Claude can open a browser; it can interact with an app; it can check the functionality of things. It is kind of like the screenshot loop, but instead of for websites and design, it is for actual functionality of apps and buttons. This is huge for front-end work, so definitely give it a try.

But this also means that it can do things like filling out forms and potentially like recaps and stuff. This is also huge because if there is not an explicit API somewhere, it can go in and manually do things. I think that it could also solve CAPTCHAs, but it is probably better if you are already signed in somewhere, and all it has to do is navigate, click buttons, and fill out things.

Hack number 22 is to clone inspiration sites. You can take screenshots of sites that you really like and feed it to Claude and say, "Make it look like this." Claude will recreate the design patterns without making it look like generic AI slot. This is huge for front-end quality because you could also use the site as inspiration by taking some of the actual HTML styling and feeding that into Claude, too. So yes, Claude could essentially clone a website, but what you want to do is take that as kind of a template and give it your own touch.

## Pro Hacks

Okay, now we are going to move on to some more advanced stuff. These hacks are for people who really want to push Cloud Code to its limits. Let's go.

All right, hack number 23 is to run parallel sessions with Git worktrees. Normally, when you are working on a project, you have it in one folder with all your files in it. If you want to run two different sessions in the same folder at the same time, they might overwrite each other's work.

That is where worktrees come in. Think of a worktree like basically making a parallel copy of your project, except it is way more efficient than actually copying the folder. You just type `claude-worktree` and then that feature name. Claude will then create an isolated workspace on its own branch. You could then open up another terminal and type in the same thing with a different feature name, and it will open up a different branch.

Now you can be working on the same project at the same time without having those coding agents step on each other. You could have three, four, or five of these things going at once. When you are done, you can have them just merge the branches back together, just like you would with any other Git branch. All the work could save back to the main project once again without overwriting each other's files.

All right, hack number 24 is to use API endpoints instead of MCP servers, depending on the situation.

What I mean by that is, MCP servers are great because you can look at all the different tools and execute any of them, but they load their entire tool definitions into the context window. If you are tight on tokens, sometimes it is better to just use direct API endpoints instead.

For example, let's say you are using Notion and you only actually need to be able to read one database. It makes no sense to show Claude how to do all of the other functions if for this specific project you only have to read one file. Instead, just hardcode in that endpoint, and now you are saving tons and tons of tokens.

All right, hack number 25 is to use `/loop` for recurring tasks. You can type, "Hey, every 5 minutes check in on the deployment." And Cloud will rerun that prompt in that same session every single 5 minutes, unless you close out of that session.

You can set it to monitor a PR, check error logs, or pull a build—whatever. It runs in the background, and it only interrupts you when something actually needs your attention. You can even set one-time reminders in natural language, like, "Remind me at 3 p.m. to check in with the team on X."

The only caveat here is these actual loops will only last for three days. If you need a scheduled automation that is a little bit longer term, then you are going to want to use the desktop scheduled tasks. Although the only difference here is every time one of those tasks spins up, it is in an individual session, so it doesn't have that context memory.

Number 26 is to host on a VPS for always-on sessions. If you want to run Cloud Code on a remote server, it will stay running even when your laptop is closed. This means you can SSH in whenever you need to interact, which means you can talk to it through Telegram anytime. This is perfect for long-running tasks where you don't want to babysit a local terminal.

Hack number 27 is you can use remote control from your phone. This is a pretty new feature, but Cloud Code now lets you control local sessions from your phone or any browser. You start a task at your local desk, and then you walk away, and you can keep steering it from your phone. Your code never actually leaves your local machine, but it is just the remote connection that is on your phone. So you can start something heavy, go grab a coffee, go on a walk, and you can keep building from your pocket.

Hack number 28 is no-SQL data analytics. You can connect CLI tools like BigQuery BQ tool to Cloud Code, and then you can just ask questions in plain English, like, "What were our top 10 revenue sources last quarter?" and Cloud will instantly translate that into the right query, run it, and then give you that answer. No SQL required, and this should work for any CLI-based tool.

Number 28 is UltraThink. When you need Cloud Code to really think through a hard problem—like architecture decisions, complex debugging, big refactors, or maybe it is just not giving you the right output after a couple prompts—try using UltraThink. You literally just type the word, and it will go all colorful. This means that it allocates the maximum thinking budget of around 32,000 tokens before Claude actually responds. Don't always use this for a simple fix, but absolutely use it if you are making decisions that might affect the entire system, or like I said, if after the first couple tries it is not giving you what you want.

Hack number 30 is to edit permissions for safe autonomy. A lot of people, including myself, have shown on videos using `dangerously_skip_permissions` to make sure that Claude can just run without asking for approval on every single step. And yeah, it is much faster, but it is called `dangerously_skip_permissions` for a reason.

The smarter way to go about it is to go into your permissions and explicitly allow the commands that you know are safe, and then explicitly deny anything that is destructive, like deletes or removes. Now you can actually get to the point where you have the same exact speed and autonomy of `dangerously_skip_permissions` without it being very dangerous. Anything in the deny list is going to take priority over anything in the allow list.

Hack number 31 is to use agent teams. Remember how we talked about sub-agents being able to run agents in parallel that have fresh context but can't talk to each other? Agent teams are like that, but all of the agents can talk to each other. It gets really, really cool. They share a task list. They can communicate with each other, and they can even assign each other work. You can actually talk to each of those individual agents instead of just having to go through the main one, and then the main one would communicate with sub-agents. These are a little bit more expensive and they do run longer, but they will give you a much more cohesive output for a big project.

Hack number 32 is Context 7 MCP. This one is a game changer. You can install the Context 7 MCP server, and then whenever you need information on current documentation, just prompt it to use that MCP server.

The problem that it solves is that Claude's training data has a cut-off, which means sometimes it might suggest functions or APIs that have been renamed, deprecated, or just don't even exist anymore. Context 7 fixes that because it has up to eight version-specific technical documentation about live code examples from thousands of popular libraries that you probably need with a coding assistant like Next.js, React, MongoDB—you name it. It is able to pull and read all current documentation and then inject it into the conversation before Claude actually starts writing any code. It is basically one command to install, and from there, all of your coding agents are working with much more up-to-date information, and it is a huge quality improvement.

## Final Thoughts

I know that we covered a ton of information in this video. What I did is I threw all of this into a PDF resource guide so you can just come back and reference them whenever you want. That is available completely for free inside of my free school community. The link for that is down in the description.

That's going to do it for this one. If you guys enjoyed or you learned something new, please give it a like. It definitely helps me out a ton. And as always, I appreciate you guys making it to the end of the video. I will see you all in the next one. Thanks everyone.
