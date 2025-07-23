<script setup lang="ts">
import { Button } from '@/components/ui/button'

const talkTemplate = `---
title: "Your Talk Title"
speaker: "Your Full Name"
speakerGithub: "YourGitHubUsername" # Optional
category: "framework-deep-dive" # Choose one: library-spotlight, framework-deep-dive, dev-tooling, recent-bugs-fixes, release-radar, behind-the-scenes, architecture-bits, misc
tags:
  - RelevantTag
  - AnotherTag
date: ${new Date().toISOString().split('T')[0]} # e.g., 2025-10-27
# Optional fields below
time: "10:30" # e.g., "14:00" (24-hour UTC format)
location: "00.003" # e.g., "01.002"
image: "https://example.com/image.png"
---

## Talk Abstract

Your talk description and content starts here...
`
</script>

<template>
  <div class="py-16 md:py-24">
    <div class="container mx-auto max-w-4xl px-6">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          Submit a New Talk
        </h1>
        <p class="mt-4 text-lg text-muted-foreground">
          Follow these steps to add your talk to our website.
        </p>
      </div>

      <div class="prose dark:prose-invert max-w-none">
        <h3>How It Works</h3>
        <p>
          Our website content is managed directly through our GitHub repository. To add a new talk, you will need to create a new markdown file and open a Pull Request.
        </p>
        <ol>
          <li>
            <strong>Fork & Clone the Repository:</strong>
            Start by forking our repository on GitHub and cloning it to your local machine.
          </li>
          <li>
            <strong>Create a New File:</strong>
            Inside the <code>content/talks/</code> directory, create a new file. Name it using a URL-friendly "slug" format, for example: <code>my-awesome-talk.md</code>.
          </li>
          <li>
            <strong>Copy the Template:</strong>
            Copy the complete markdown template below and paste it into your new file.
          </li>
          <li>
            <strong>Fill in the Details:</strong>
            Edit the content to match your talk's information.
          </li>
          <li>
            <strong>Open a Pull Request:</strong>
            Commit your new file to a new branch and open a Pull Request on our GitHub repository. We will review it and merge it in.
          </li>
        </ol>

        <div class="text-center my-8">
          <Button size="lg" as-child>
            <a href="https://github.com/uniwue-zpd/dachs-tech-talks" target="_blank" rel="noopener noreferrer">
              <Icon name="carbon:logo-github" width="5" height="5" />
              Go to GitHub Repository
            </a>
          </Button>
        </div>

        <h3>Talk Markdown Template</h3>
        <p>
          Copy the entire block below into your new <code>.md</code> file.
        </p>
        <pre class="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap"><code>{{ talkTemplate }}</code></pre>
      </div>
    </div>
  </div>
</template>
