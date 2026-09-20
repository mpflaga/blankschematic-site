---
marp: true
theme: default
paginate: true
style: |
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Instrument+Serif&family=Share+Tech+Mono&display=swap');

  section {
    font-family: 'Barlow', sans-serif;
    background: #f4f1ec;
    color: #1a1510;
    border-top: 5px solid transparent;
    border-image: linear-gradient(to right, #d63b2f 0%, #0096b4 25%, #e8a435 50%, #8b4dab 75%, #333 100%) 1;
    padding-top: 40px;
  }
  h1 {
    font-family: 'Instrument Serif', serif;
    color: #0096b4;
    border-bottom: 2px solid #ddd5c8;
    padding-bottom: 0.3em;
    font-size: 1.6em;
  }
  h2 {
    font-family: 'Instrument Serif', serif;
    color: #1a1510;
  }
  h3 { color: #5a4a3a; font-family: 'Share Tech Mono', monospace; font-size: 0.95em; }
  code {
    font-family: 'Share Tech Mono', monospace;
    background: #1a1510;
    color: #e8a435;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.85em;
  }
  pre {
    font-family: 'Share Tech Mono', monospace;
    background: #1a1510;
    color: #f4f1ec;
    padding: 1em;
    border-radius: 6px;
    border-left: 4px solid #0096b4;
  }
  pre code { background: transparent; padding: 0; color: #f4f1ec; }
  blockquote {
    border-left: 4px solid #e8a435;
    background: #ede9e3;
    padding: 0.6em 1em;
    color: #5a4a3a;
    font-style: italic;
    margin: 0.5em 0;
  }
  a { color: #0096b4; }
  strong { color: #d63b2f; }
  em { color: #5a4a3a; }
  ul li { margin: 0.5em 0; font-size: 1.02em; }
  section::after {
    font-family: 'Share Tech Mono', monospace;
    color: #8a7a6a;
    font-size: 0.75em;
  }
  section.title {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #1a1510;
    color: #f4f1ec;
    border-image: none;
    border-top: 5px solid #0096b4;
  }
  section.title h1 {
    font-family: 'Instrument Serif', serif;
    border: none;
    font-size: 2.4em;
    color: #f4f1ec;
  }
  section.title h2 {
    color: #0096b4;
    border: none;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1em;
    font-weight: normal;
  }
  section.title h3 { color: #8a7a6a; font-family: 'Share Tech Mono', monospace; }
  section.title p { color: #c4a882; font-size: 1.1em; }
  section.title strong { color: #e8a435; }
  section.title::after { color: #3a2f22; }
  section.divider {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #ede9e3;
  }
  section.divider h1 { border: none; font-size: 2em; color: #d63b2f; font-family: 'Instrument Serif', serif; }
  section.divider p { color: #5a4a3a; font-size: 1.2em; }
  table { border-collapse: collapse; width: 100%; }
  th {
    background: #1a1510;
    color: #f4f1ec;
    padding: 0.5em 0.8em;
    text-align: left;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9em;
    font-weight: normal;
  }
  td { padding: 0.4em 0.8em; border-bottom: 1px solid #ddd5c8; color: #1a1510; }
  tr:nth-child(even) td { background: #ede9e3; }
---

## The Problem

I've built a lot of stuff over the years.

Photos are in Google Photos. Code is on GitHub. Projects on Hackaday, Instructables, Thingiverse. Notes are everywhere.

**But none of it was in one place anyone could actually look at.**

I wanted a website — just didn't want to spend weeks making one.

---

<!-- _class: title -->

# How I Built a Website with an AI
### blankschematic.com — zero to live in about two hours

---

## The Setup

I use an AI called **Claude** inside VS Code — my code editor.

For each project I'd throw it everything I could find:

- GitHub repo links
- Google Photos album links
- "Also search Hackaday, Instructables, Thingiverse for this project"

Then Claude goes and reads it all.

---

## What That Looked Like

I just babble — every little thought, in whatever order it comes out:

> "HarpsiGourd. Pumpkins as piano keys. Halloween. Maker Faire.
> Lansing Makers Network. It was on Hackaday. Here's the repo link.
> Oh and it has an idle demo mode too."

Claude takes all of that, pulls in the links, and builds a **Markdown file**.

MD files are simple plain text — easy to read, easy to edit, easy to keep track of. Later Hugo converts them to HTML for the website.

We knocked out about 20 projects in the first session. Then I kept coming back — adding more as I thought of them. Now at 44, and adding one takes about 5 minutes.

---

## What "Vibing" Means Here

It's just a conversation.

- Claude drafts something locally
- I react to it — tweak the tone, add context, connect related projects
- Files appear in VS Code as we go

No copy-pasting. No manual formatting.
The pages just… showed up.

---

<!-- _class: divider -->

# So how does it become a website?

---

## Text Files → Website

A tool called **Hugo** runs locally on my machine and turns all those text files into a complete website.

I can preview it in a browser before anything goes live — every save rebuilds it instantly.

No hand-coding web pages. No design from scratch.

With 44 projects across 8 categories, finding things gets tricky — so a **search feature** was added. It automatically indexes every page so visitors can search by keyword instantly, right in the browser.

---

## GitHub → Internet

Everything lives in a **GitHub repo** — GitHub is the cloud service that stores and tracks every change made to the files.

**Cloudflare Pages** is a free hosting service — it watches the GitHub repo, and the moment anything is pushed it automatically pulls the files and publishes the updated site.

**Process Flow:**
Vibe → Push → GitHub → Cloudflare Pages → render as HTML → live on the internet. About 60 seconds.

---

## The Domain

**blankschematic.com** was registered directly through Cloudflare.

Cloudflare sells domains at-cost — no markup — so a .com runs about **$9–10/year**. Since the hosting is already on Cloudflare Pages for free, buying the domain there too means everything is wired together automatically. No separate DNS configuration, no extra services.

Total annual cost: a cup of coffee.

---

## Start to Finish — About Two Hours

| | |
|---|---|
| 0 min | Empty folder |
| ~20 min | Basic site structure running locally |
| ~60 min | First real project pages written with Claude |
| ~90 min | Cloudflare connected, domain pointed |
| **~2 hours** | **blankschematic.com live** |

---

<!-- _class: title -->

## You don't need to be a web developer.

You just need your stuff to already exist somewhere —
and an AI that can **read where it lives**.

**blankschematic.com**

---

<!-- _class: title -->

# Questions?

---

<!-- _class: title -->

# Yes — this presentation was also made by vibing with Claude.
