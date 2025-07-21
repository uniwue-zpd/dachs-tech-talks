<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqItems = [
  {
    value: 'item-1',
    question: 'Who can attend the talks?',
    answer: 'DACHS Tech Talks are an internal event for all employees and student research assistants at DACHS (Digital Applications in Humanities Studies), a research group at the Centre for Philology and Digitality (ZPD), University of Würzburg.',
  },
  {
    value: 'item-2',
    question: 'How do I give a talk?',
    answer: 'We are always looking for new speakers! If you have something you\'d like to present, you can submit your talk through our GitHub repository. Just click the "Submit a Talk" button on this page, and it will take you to our issue template.',
  },
  {
    value: 'item-3',
    question: 'Can I suggest a topic for a talk?',
    answer: 'Absolutely! If there is a specific technology, library, or concept you would like to see covered, please submit a proposal. You can use the same GitHub issue template as for submitting a full talk; just make it clear that you are proposing a topic for others to potentially pick up.',
  },
  {
    value: 'item-4',
    question: 'What kind of topics are you looking for?',
    answer: 'We welcome a wide range of topics, from deep dives into specific frameworks and libraries to discussions on software architecture, development tooling, bug-fixing war stories, and new technology releases. If it\'s related to technology and you\'re passionate about it, we want to hear about it!',
  },
  {
    value: 'item-5',
    question: 'How long should a talk be?',
    answer: 'A typical talk should be around 10-15 minutes, followed by a short Q&A session. This format allows us to cover a topic in sufficient detail while keeping the sessions engaging and concise.',
  },
]
</script>

<template>
  <div class="text-foreground">
    <section class="py-20 md:py-24">
      <div class="container mx-auto px-6 max-w-3xl">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
            About DACHS Tech Talks
          </h1>
          <p class="mt-4 text-lg text-muted-foreground">
            Everything you need to know about our internal knowledge-sharing sessions.
          </p>
        </div>
        <Accordion type="single" class="w-full" collapsible>
          <AccordionItem v-for="item in faqItems" :key="item.value" :value="item.value">
            <AccordionTrigger class="text-lg text-left">{{ item.question }}</AccordionTrigger>
            <AccordionContent class="text-base text-muted-foreground">
              {{ item.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
    <AboutCallToAction />
  </div>
</template>
