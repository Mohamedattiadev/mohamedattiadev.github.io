# 30 side projects in 18 months — what I actually learned

A twenty-two minute read — worth the time only if you are trying to ship. I wrote it because the same questions keep landing in my DMs, and writing the answer once beats typing it ten times. Student, junior dev, or anyone building small software without burning out: use the headings, skip anything that does not match where you are right now.

## Why I started

I was bored in class. That is the honest answer. The lectures moved at the speed of the slowest person in the room, and I learn faster by building. So I made a deal with myself: ship one small project per week, no matter how small, for as long as I felt like it. Eighteen months later I have thirty-three of them on my GitHub. About six are dead. About four are actually used by people other than me. The rest exist as small wins, small lessons, or small embarrassments. All three are useful in their own way.

The point was never to be famous or to make money. The point was to finish things. School trains you to start and submit, not to start and ship. There is a big difference. Shipping means somebody else uses it. Submitting means somebody else grades it. Once you taste the first kind, the second feels like cheating yourself.

## The first ten projects

The first ten were rough. Looking back I cannot defend any of them. They were copy-paste tutorials with a paint job. But they taught me three things that nothing else could have taught me.

### Tools I used

I started with what was familiar. Node and Express. A tiny bit of React. Bootstrap, because picking colors is hard when you are twenty. I deployed everything to Heroku in the days when the free tier still existed, and then to Vercel when Heroku closed the free door.

I did not pick a framework. I did not benchmark anything. I did not even have a linter for the first few months. I just wrote code, broke code, fixed code, and pushed to GitHub. Looking back, this was the right call. Optimization without traffic is theater.

### Common mistakes

Three mistakes I made over and over again in those first ten:

- **Starting with a database before I had a problem.** Every project began with `npx prisma init` or `createdb mything`. Most of them never needed a database. A JSON file in the repo would have been enough for the small dataset I actually used.
- **Adding authentication on day one.** Sign up, sign in, password reset, magic link, Google login. Hours of work. None of my early projects had two users. Zero auth would have shipped faster.
- **Writing my own design system.** I built a "shared components" folder in every project. None of them got reused. They were too specific. I should have used the default browser styles for the first month and only extracted things after I saw the duplication.

If you are starting, please learn from this. Use a static file. Skip auth until somebody asks. Style with the platform.

## Habits that made me ship more

Around project number ten I started counting. How many days did the average project take from `git init` to "I told a friend the URL"? It was twenty-three days. That was too slow. So I built a few habits to push that number down. After a year of practice, the new average is six days. Here is what changed.

### The thirty-minute rule

If a problem takes more than thirty minutes to solve and I have not even started the actual project, I am over-engineering. The clearest example is build tooling. I once spent two hours setting up TypeScript paths, ESLint configs, Prettier rules, husky hooks, lint-staged, and commit-msg validation — for a project that ended up being three files.

The rule now: until I have a working, ugly, deployable version, no tooling. Just write the code. Add the niceties after the first user (often me) has touched the running thing. Almost every project gets killed before tooling matters anyway.

### Writing the README first

This one was a hard sell. I used to write the README after I shipped. Or never. Or three sentences and a `npm install` line.

Now I write a draft README before the first commit. Not a polished one. Just three things:

- **Title and one sentence** of what the thing does.
- **Three bullets** of what it does *not* do.
- **One example** of how a user would use it.

If I cannot fill those three things, the idea is not ready. The README forces clarity. Writing it takes ten minutes. Skipping it costs days because I end up building the wrong thing.

### A single deploy command

The fastest way to lose interest in a project is friction between "I changed something" and "the live site shows it". I now require a one-command deploy on day one. Even for a project I am throwing away. Sometimes that is `vercel --prod`. Sometimes `gh-pages -d dist`. Sometimes a shell script that does `rsync` to a VPS. It does not matter. What matters is the friction. If it takes me ten clicks to deploy, I will deploy ten times less.

## Stack choices that changed over time

Eighteen months is enough to flip an opinion or two. Here are the big ones.

### Why I dropped React for side projects

React is great at work, where there is a team and a long-running app. For weekend projects it is overkill. The setup is heavy. The hydration model is confusing for static content. Hot reload bugs eat time. And ninety percent of what I want to build is a few pages with some interactivity.

I now reach for vanilla HTML, CSS, and ES modules first. If I need reactive state, I add Alpine.js (less than 15 KB). If I need a router, I write a hash router in 20 lines. If I need build steps, I add them later, never first.

This is not a fight against React. It is a fight against ceremony. Side projects die from ceremony.

### Go vs Node for CLIs

I have written about twelve CLIs across both. The verdict is clear for me: Go wins for anything I want to share. Reasons:

- **One binary.** I can hand my friend a file. No `npm install -g`. No version manager wars. No "but I have node 14".
- **Cross-compile in one command.** `GOOS=darwin GOARCH=arm64 go build` and I have a mac binary. Try doing that with Node and pkg without losing an hour.
- **Standard library is a kit.** Want to parse flags? `flag`. Want to serve HTTP? `net/http`. Want to make HTTP requests? Same. No three different libraries fighting.

Node still wins for tools I only run on my own machine, or for projects where I want to share code between a frontend and a CLI. But for anything I want a stranger to install in under thirty seconds, Go wins.

### SQLite as a default

A year ago my default was Postgres. Today my default is SQLite. The reason is simple: I almost never have two servers writing to the same database. For everything else, SQLite is faster to set up, easier to back up (it is one file), and supports more than I will ever need for a side project.

For sites with one user (me), I have used a JSON file. For sites with a few hundred users, SQLite. For sites with more (none yet), I would reach for Postgres. The point is: choose the smallest thing that works.

## Projects that failed

Six of my thirty-three are dead. Looking at them honestly:

- **A study-flashcards app** — Failed because Anki already exists and is good. I did not have a real reason for it to be different.
- **A budgeting site** — Failed because I had no money to budget. Hard to dogfood.
- **An IDE plugin** — Failed because I do not know enough about the host editor to make it stable. I shipped a buggy version, got two angry issues, and burned out.
- **A "Twitter for X" clone** — Failed because nobody wants Twitter for X. I knew this. I built it anyway.
- **A web scraper as a service** — Failed because every site I scraped changed within a month. Maintenance nightmare. Killed it.
- **A landing-page generator** — Failed because the people who need landing pages do not write code, and the people who write code can make their own landing pages.

The pattern is clear: I built things I did not actually need, or that solved a problem too small to care about, or that required ongoing maintenance I did not want to do.

The lesson: only build things you would personally use. Then maintenance is automatic, because you use the thing.

## Projects that worked

Four of mine get used by people who are not me:

- **A dotfile installer** that picks up about ten downloads a week. Friends use it. Strangers occasionally star it.
- **A study-notes vault** built on Excalidraw that classmates copy and rename for their own notes.
- **An auto-clicker for the Claude CLI** that has been forked twice and used by a small Discord group.
- **This portfolio**, which is the most-visited URL I own.

What do they have in common? Each one solved a real problem I personally had, and the build was small enough that I shipped it before I lost interest.

That is the whole formula. There is no marketing trick. There is no growth hack. There is "do I personally use this every week?" If yes, ship it. If no, kill it before you start.

## Open source lessons

Putting code on GitHub feels easy. Building something other people use is much harder. A few specific things I learned.

### Naming repos

Bad repo names hurt you twice: in search, and in respect. My first repos were named things like `myapp2`, `test-flask`, `Newdotfile-` (with the dash, do not ask). Today I follow three rules:

1. **One or two words.** `notes`, `dotfiles`, `auto-claude`. Easy to type, easy to say.
2. **No underscores or trailing dashes.** Use hyphens, end on a letter. Search engines and humans both prefer this.
3. **Match the binary name.** If your CLI is called `dot`, the repo is `dot`. Not `dot-installer`, not `dot-cli`. Mismatch causes confusion.

A good repo name is the first sentence of your README.

### READMEs that convert

By "convert" I mean turn a casual visitor into a user. My before-and-after on this is striking.

Before: I would write a README that explained how the project worked internally. Architecture diagrams, design decisions, my life story. Nobody read past the first paragraph.

After: I write a README that answers three questions in order: "what is this?", "how do I use it in one line?", "what does it look like?". Every other detail goes into a `/docs` folder or a blog post.

The biggest change was adding a GIF or screenshot near the top. People believe pictures. They do not believe paragraphs.

### Issues nobody reads

Most of my early projects had three or four issues opened that I never answered. I felt guilty about it for months. I should not have.

If you do not have time to maintain an issue tracker, do not pretend you do. Add a line to the README that says "This is a personal project. I may not respond to issues. Forks welcome." Then people know what to expect, and you can sleep.

The worst thing is leaving issues open and unanswered for years. That signals an abandoned project. Closing them with a "thank you, not planning to fix" is better than silence.

## Money and time

People ask: how do you have time? The honest answer is: I do not watch much TV.

I am a student. I have classes. I have a part-time tutoring gig. I sleep seven hours. And I spend about ten to fifteen hours a week on side projects, broken into one-hour chunks throughout the week, plus one longer Sunday session.

That is enough to ship a small project every two weeks if I am picking my battles. Most weeks I do not ship. I just chip away at something bigger or fix bugs on a thing I already shipped. The shipping cadence is not constant.

About money: zero of my side projects make money. I have not tried. Everything I have built is free. This is on purpose. Adding a paid tier means adding billing, refunds, customer support, taxes, terms of service, privacy policies, and a thousand other things. None of which I want to do as a student. I might someday. Right now, free is freedom.

## Mental health and burnout

This part nobody talks about, but it is the most important. Shipping a lot is not a virtue if it costs you your health.

I burned out twice in eighteen months. Both times it was the same pattern: I would stack three projects on top of each other, feel guilty for not finishing the oldest, and freeze. Then I would feel guilty for freezing, which made the freeze worse.

What got me out of it was simple but hard to do:

- **One project at a time.** If I start something new, I either ship the old one or archive it. No more than one "in progress" repo at a time.
- **A real day off per week.** No code. No GitHub. Walk, read, see friends.
- **No comparing.** When I see somebody on Twitter shipping daily I close the tab. They are not me. Their projects are not my projects. Their timeline is not my timeline.

If you are starting out, please believe me: the people you admire who "ship every day" are mostly bots, marketing performances, or burning out off-camera. Sustainability beats velocity over five years. Pick the long game.

## Tooling stack today

For anyone who wants a copy-paste starting point, here is what I use right now:

- **Editor**: Neovim with about twenty plugins. I have a `.config/nvim` folder I sync across machines.
- **Terminal**: Ghostty. Came from kitty. Both are fine.
- **Shell**: zsh with the default prompt and three aliases. I deleted oh-my-zsh; it was slow and I did not use the features.
- **Browser**: Brave for daily use, Chrome for testing.
- **Languages**: TypeScript and Go are home. Python for one-off scripts. I am learning Rust slowly.
- **Backend**: Hono on Cloudflare Workers when I want serverless. Plain Go on a $5 VPS when I want long-running.
- **Database**: SQLite by default. Postgres if I expect more than one writer.
- **Deploy**: Vercel for frontends. GitHub Actions plus rsync for VPS. Cloudflare Pages for static.
- **CI**: GitHub Actions. Free, reliable, decent docs.
- **Notes**: Plain markdown files in a folder synced via syncthing. I tried Obsidian, Notion, Logseq. They all became another thing to maintain. Plain text wins.

There is nothing exotic in that list. Boring tools, used carefully, beat shiny tools used randomly.

## What I would tell a younger me

If I could time-travel and hand my eighteen-year-old self one note, it would say:

> Stop trying to be a better engineer. Start trying to be a person who ships. Engineering quality goes up automatically when you ship enough times to feel the pain of bad decisions. You cannot read your way there.

Specific advice that follows from that:

- **Pick a stack and stay there.** You will be tempted to learn every new framework. Most of them will be gone in three years. Boring tools last.
- **Read more code than you write.** Especially other people's pull requests on projects you use. The diff is the lesson.
- **Write commit messages first.** If you cannot describe the change in one line, the change is too big. Split it.
- **Delete more than you add.** Every line of code is a small liability. Code you did not write is code that cannot break.
- **Talk to humans about your projects.** Not in a "marketing" way. Just say "I built this, it does X, would you use it?" The answers are gold.
- **Sleep.** Tired code is bad code. There are no exceptions.
- **Pick small fights.** A 50-line tool you actually use beats a 5,000-line tool that nobody, including you, runs.

## What I am building next

Three things have my attention right now. I write them down here so I am accountable in three months.

- **A package manager for shell tools written as single Go binaries.** Working name `dcli-pkgs`. The idea: `dcli install xxx` and it just lands a binary in your PATH. No more "where do I put this".
- **A YouTube wrapper that asks why I am opening it before showing the feed.** A "self-shaming as a service" tool. Behavioral, not technical.
- **An unofficial student guide for AYBU SE students.** Curriculum map, internship rules, faculty cheat-sheet. Already a single HTML page; I want to turn it into a real resource.

If any of these still make sense in three months, they will be on the Work page. If not, they will be in the failed list above. Either outcome is fine. Building is the point. Shipping is the metric. Learning is the prize.

## Closing

If you took one thing from this post, I hope it is this: do not wait for permission. Do not wait until you "know enough". Do not wait until you have a perfect idea. Pick the smallest version of any thing you want to make and ship it next week. The lessons come from shipping, not from planning. The respect comes from finishing, not from starting.

Eighteen months ago I was a bored student copying tutorials. Today I run a portfolio with thirty-something repos, a journal nobody asked for, and a clearer head than I have had in years. Nothing about me is unusual. The only thing I did was decide to finish things.

You can do the same. Start today. Ship by Friday.

## Tools I tried and quit

Not every tool earns a place in my daily kit. Here is a list of what I tried, used for at least two weeks, and then dropped. Maybe these still work for you. They did not for me.

- **Obsidian.** Beautiful. Powerful plugin system. But every six months I had a plugin break, a vault corrupt, a sync conflict. I switched to plain markdown in a synced folder and the chaos stopped.
- **Notion.** Great for shared docs at work. Painful for personal notes. The block model is fighting markdown when all I want is markdown. The mobile app eats my battery.
- **Logseq.** Same family as Obsidian. Same fate. Outliner thinking does not match how my brain stores facts.
- **VSCode.** I used it for a year. The window felt heavy. Startup was slow. I switched to Neovim for the speed and never went back. To be clear: VSCode is excellent. It is just not for me.
- **Docker for everything.** I used to wrap every side project in a Dockerfile. Now I only do it when I am going to deploy to a container platform. Local dev with Docker added five seconds of "wait for the daemon" before every change. Multiply by a hundred restarts per day.
- **Tailwind for tiny projects.** I love Tailwind at work. For a five-page site, the setup costs more than the value. I use plain CSS classes for anything under twenty components.
- **Most CSS frameworks.** Bootstrap, Bulma, Skeleton, Pico. Each saved me time on day one and stole time on day fifty when I needed to override the framework's defaults.
- **Jest.** Switched to Vitest for any JavaScript that I bundle, and to Go's built-in testing for anything Go. Simpler, faster, less config.
- **Husky.** Pre-commit hooks are nice in theory. In practice, they fire on every commit, including the one where I am committing a half-broken WIP because I am switching machines. I deleted all my hooks and now run linters manually before pushing.

A theme runs through this list: tools designed for teams are usually overkill for one person. Solo, you can move faster with less.

## Reading list that actually helped

When people ask me how to "get better at programming" I no longer point at books. I point at code. But there are five things I actually finished reading in the last eighteen months that changed how I work. In rough order of usefulness to a student:

- **The Pragmatic Programmer** (20th anniversary edition). The advice is old, but old does not mean wrong. The chapter on "broken windows" alone is worth the price.
- **A Philosophy of Software Design** by John Ousterhout. Short. Focused. The "deep modules" idea reshaped how I think about API surfaces. I re-read chapters every few months.
- **Designing Data-Intensive Applications** by Martin Kleppmann. I have not finished it yet, but the half I read explained more about real-world systems than four semesters of database class.
- **Patterns of Enterprise Application Architecture** by Martin Fowler. Heavy reading. Skip around. The vocabulary alone (repository, unit of work, identity map) makes job interviews easier.
- The source code of **htmx** and **Hono**. Reading well-written small codebases beats reading any book. Both fit in one head.

I do not read for the sake of reading. I read when I hit a wall in a project and need a model to solve a real problem. That is the difference between learning and procrastinating. Picking up a book to avoid the keyboard is procrastination. Picking up a book because the keyboard sent you there is learning.

## Stack snapshots over 18 months

Looking at my git history, my "default stack" mutated a lot. Here are three snapshots that show the drift.

### Month one stack

- React with Create React App (yes, that long ago for me)
- Bootstrap
- Express on the backend
- Postgres because someone in a tutorial said to
- Deploy to Heroku free tier
- VSCode with thirty extensions

This stack worked, in the sense that things ran. But every project took weeks because the moving parts were many, and most of them did things I did not need.

### Month nine stack

- Next.js for everything
- Tailwind
- Drizzle ORM with Postgres
- Vercel for everything
- Neovim with maybe ten plugins

Faster than month one. But still heavy. Cold starts on Vercel functions annoyed me. Vendor lock-in started to feel real. Migration costs scared me.

### Month eighteen stack (today)

- Vanilla HTML/CSS/ES modules for static sites (this portfolio)
- Hono on Cloudflare Workers when I need an API
- Go binaries for CLIs
- SQLite as default storage
- GitHub Pages for static, Cloudflare for dynamic
- Neovim with about twenty plugins, mostly LSP setup

Less ceremony. More finishing. The lesson, in one sentence: the stack got smaller as I got better.

## A typical week

If you want to copy any one habit from this post, copy the schedule. Time is the resource. Everything else follows.

Here is my real Tuesday-to-Sunday split:

- **Monday morning.** Plan the week. Open a notebook (paper). Write the three things I want to push by Sunday. Three is the limit, not the goal.
- **Tuesday to Thursday evenings.** One-hour focused sessions. Phone in another room. The aim is one commit per session, even if the commit is small.
- **Friday afternoon.** No coding. I do something else. Walk, see a friend, read fiction. Brain off.
- **Saturday morning.** Two-hour deep work session. This is where the hard problems get solved.
- **Saturday afternoon.** Boring chores. Email, laundry, groceries. Yes, this is a productivity move. Saturday afternoon is the trash window of the week. Use it for the things that fight focus.
- **Sunday evening.** Shipping. If anything is going live this week, it goes live now. I publish, I tweet, I send the link to a friend. Then I close the laptop and watch a movie.

The shape matters more than the hours. A consistent rhythm beats heroic sprints. Heroic sprints look great on social media. They cost you the next two weeks.

## Quick FAQ

People keep asking me the same questions in DMs. Here are the short answers:

**Q: Are you AI-generating any of these projects?**
No. I use AI for code suggestions in my editor, like most people, but the ideas, the architecture, and the writing are mine. This post is mine. If you cannot tell from the typos, that says something.

**Q: How do you pick what to build?**
I keep a small "problems file" in my notes folder. Every time something annoys me in my own day, I add a line. Once a month I scan the file. If the same problem shows up twice, it goes to the top of the maybe-build list. Most ideas die in that file. The good ones come up again.

**Q: What if I do not have any problems to solve?**
You do. You are not paying attention. Try this for a week: every time you say "ugh" or "why is this so hard", write it down. By Sunday you will have ten things, and three of them will be projects.

**Q: How important is a domain name?**
For your portfolio, useful but not required. The default `username.github.io` is a strong signal that you actually code. For projects, totally optional. Most of my projects live at GitHub Pages URLs and that is fine.

**Q: How do you stay motivated?**
I do not, always. I have months where I ship nothing. I have weeks where I question all of it. The trick is not to be motivated constantly, it is to have a system that survives the low weeks. The system is: one project at a time, one small commit per day, one day off per week, one Sunday session. Even at my lowest, I can do that.

**Q: What if my code is bad?**
It is. Mine too. Ship it anyway. You will not improve in a vacuum. Real users will find the bugs you cannot see. Stack Overflow will teach you what your professors will not. Embarrassment is a feature, not a bug, of the early shipper.

**Q: Should I write tests for side projects?**
For small ones, no. For anything you depend on weekly, yes. Tests are a maintenance investment. You make them pay off by needing to maintain the project for longer than the test cost. For a weekend project, the math fails.

**Q: How do you handle being a beginner around senior engineers?**
Ask many questions. Pretend less. Senior engineers I respect love teaching. Senior engineers who roll their eyes are not the ones to learn from. Find people who get excited explaining things and stick around them.

**Q: What is the one habit that helped you the most?**
The thirty-minute rule. If a problem takes more than thirty minutes and I have not started building the actual project, I am stalling. Either change the approach, or shrink the scope, or call it done and ship. The clock is a friend.

## A note on this site itself

This portfolio you are reading is, in some ways, the most useful project I have ever made for myself. Not because the code is special. The code is small. The reason it is useful: it gives me a stage to put work in front of strangers, a feedback loop for writing, and a forcing function to keep finishing things.

Building the site is also where I learned the most non-code lessons of this whole journey: that taste matters, that small details matter, that one extra hour spent on the README pays off in a way that ten hours on internals never will.

If you are reading this and do not have a portfolio yet, build one. Pick the smallest possible template. Add your face, your name, your projects, your contact. Ship it. Iterate. Add a journal like this one in three months once you have something to say.

The portfolio is the meta-project. It teaches you what you actually believe about your work. The day you have to write your own About page is the day you find out.

## Three small wins that compound

Some habits look tiny on day one but pay enormous dividends over a year. Three I would pick out of all the lessons above:

- **Commit every working session.** Even if it is one line. Even if you are not "done". A repo with daily commits looks alive to recruiters, teaches you to think in small steps, and saves your work when your laptop dies on a flight. The cost is one extra `git commit -m` per hour. The return is everything.
- **Open three random pull requests on a project you use, every week.** Just read them. No need to comment. You will absorb the unwritten rules of how good teams disagree, how senior engineers ask questions, how a real review reads.
- **Email yourself a one-line summary of what you shipped each Sunday.** I started doing this six months ago. The folder is now a record of progress I can actually feel. On the bad weeks, scrolling that folder beats any motivational video.

None of these takes more than ten minutes a week. After a year, you have a record of growth, a richer mental model of the field, and a stack of micro-commits that make your GitHub graph green. Compounding is the only superpower a beginner has. Use it.

## Goodbye for now

If you read all the way to here, thank you. I hope something stuck. I hope you close the tab and go ship a tiny thing. The world has enough plans. It needs more pushes to main.

If you want to talk about any of this, my email is on the Contact page. I read everything. I reply to most.

See you on the next post.
