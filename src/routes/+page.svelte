<script>
  import Appointment from '$lib/components/Placeholder.svelte';
  /**
   * This dataset will preferably be loaded in via serverside request to a db or an API call
   * or you can use stores.
   */
  const wordsAndTheirMeaning = {
    meta: {
      date: Date.now(),
      topic: 'English',
      objective: {
        description: 'Can you translate the words to English?',
        translateTo: 'Dutch',
      },
      level: 'HAVO',
      year: 3,
    },
    data: [
      {
        word: 'necessary',
        description: 'nodig',
        sentence: 'Is it necessary to tune your guitar',
      },
      {
        word: 'perform',
        description: 'uitvoeren',
        sentence: 'I would like to perform this poem for my mothers funeral',
      },
      {
        word: 'possible',
        description: 'mogelijk',
        sentence: 'Is it possible to sing at your birthday?',
      },
      {
        word: 'practise',
        description: 'oefenen',
        sentence: 'I have to practise a lot to become an expert',
      },
      {
        word: 'atmosphere',
        description: 'sfeer',
        sentence: 'The atmosphere in this building is really intimidating',
      },
      {
        word: 'crowded',
        description: 'druk',
        sentence: 'Rotterdam is a really crowded city',
      },
      {
        word: 'terrible',
        description: 'verschrikkelijk (slecht)',
        sentence: 'This album by the Foo Fighters is terrible',
      },
      {
        word: 'transport',
        description: 'vervoer',
        sentence: 'What is your favourite transport? Mine is a BMW Z3',
      },
      {
        word: 'poor',
        description: 'slecht',
        sentence: 'Ajax played really poor today. The lost 1-0',
      },
      {
        word: 'repetitive',
        description: 'eentonig',
        sentence: 'This is a really repetitive sound, i like it?',
      },
    ],
  };
  const difficultWords = {
    meta: {
      lastTimeTried: 'today',
    },
    data: [
      {
        word: 'transport',
        description: 'vervoer',
        sentence: 'What is your favourite transport? Mine is a BMW Z3',
      },
      {
        word: 'poor',
        description: 'slecht',
        sentence: 'Ajax played really poor today. The lost 1-0',
      },
      {
        word: 'repetitive',
        description: 'eentonig',
        sentence: 'This is a really repetitive sound, i like it?',
      },
    ],
  };

  const lastLearnedWords = {
    meta: {
      lastTimeTried: 'today',
    },
    data: [
      {
        word: 'necessary',
        description: 'nodig',
        sentence: 'Is it necessary to tune your guitar',
      },
      {
        word: 'perform',
        description: 'uitvoeren',
        sentence: 'I would like to perform this poem for my mothers funeral',
      },
      {
        word: 'possible',
        description: 'mogelijk',
        sentence: 'Is it possible to sing at your birthday?',
      },
    ],
  };
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Flashcards boilerplate" />
</svelte:head>

<nav>
  <p>navigation?</p>
</nav>
<div class="relative h-screen w-full mx-auto flex flex-col">
  <section>
    <p>sidebar?</p>
  </section>
  <section>
    <p>main?</p>
  </section>
</div>

<style>
  /* Please use tailwindcss predefined classes as much as possible */
</style>
