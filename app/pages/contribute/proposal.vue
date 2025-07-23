<script setup lang="ts">
import { Button } from '@/components/ui/button'

const proposalTemplate = `---
title: "Your Proposal Title"
tags:
  - RelevantTag
  - AnotherTag
---

## Proposal Details

Your proposal description and content starts here...
`
</script>

<template>
  <div class="py-16 md:py-24">
    <div class="container mx-auto max-w-4xl px-6">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          Propose a New Topic
        </h1>
        <p class="mt-4 text-lg text-muted-foreground">
          Have an idea for a talk? Follow these steps to add it to our proposals list.
        </p>
      </div>

      <div class="prose dark:prose-invert max-w-none">
        <h3>How It Works</h3>
        <p>
          Talk proposals are managed through our GitHub repository. This allows the community to see and discuss potential future topics.
        </p>
        <ol>
          <li>
            <strong>Fork & Clone the Repository:</strong>
            Start by forking our repository on GitHub and cloning it to your local machine.
          </li>
          <li>
            <strong>Create a New File:</strong>
            Inside the <code>content/proposals/</code> directory, create a new file. Name it using a URL-friendly "slug" format, for example: <code>exploring-new-library.md</code>.
          </li>
          <li>
            <strong>Copy the Template:</strong>
            Copy the complete markdown template below and paste it into your new file.
          </li>
          <li>
            <strong>Fill in the Details:</strong>
            Describe your idea for the talk.
          </li>
          <li>
            <strong>Open a Pull Request:</strong>
            Commit your new file to a new branch and open a Pull Request. We will review it and merge it in.
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

        <h3>Proposal Markdown Template</h3>
        <p>
          Copy the entire block below into your new <code>.md</code> file.
        </p>
        <pre class="bg-accent-foreground text-primary-foreground rounded-lg p-4 text-sm whitespace-pre-wrap"><code>{{ proposalTemplate }}</code></pre>
      </div>
    </div>
  </div>
</template>
