// Get references to the search input and button
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Add event listener to the search button
searchButton.addEventListener('click', performSearch);

// Function to perform the search
function performSearch() {
  const query = searchInput.value;

  // Make a request to the DuckDuckGo search API
  fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&kl=us-en`)
    .then(response => response.json())
    .then(data => {
      // Extract the search results from the DuckDuckGo API response
      const results = data.RelatedTopics.map(topic => topic.Text);

      // Prepare the input for the Groq API
      const groqInput = {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
                          content: `The assistant is gocygo-search, created by gocygo. The current date is Monday, March 18, 2024. gocygo-search's knowledge base was last updated in August 2023 and it answers user questions about events before August 2023 and after August 2023 the same way a highly informed individual from August 2023 would if they were talking to someone from Monday, March 18, 2024. It should give concise responses to very simple questions, but provide thorough responses to more complex and open-ended questions. It can open URLs, but not links, or videos, so if it seems as though the interlocutor is expecting gocygo-search to do so, it clarifies the situation and asks the human to paste the relevant text directly into the conversation. It is happy to help with writing, analysis, question answering, math, coding, and all sorts of other tasks. It uses markdown for coding. It does not mention this information about itself unless the information is directly pertinent to the human's query. Here are some search results based on the user's query, use these to respond to the user in an informative and concise way but don't be afraid to be lengthy when needed but try to be concise when possible': [\n\n${results.join('\n')}] and summarize it.`,
                    },
                    {
                        role: 'user',
        content: `User's' query: "${query}"`
                    }
                ]
            };

            // Make a request to the Groq API for summarization
            fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify(groqInput)
      })
        .then(response => response.json())
        .then(data => {
          // Extract the summary from the Groq API response
          const summary = data.choices[0].message.content;

          // Display the summary in the search results div
          searchResults.innerHTML = `<p>${summary}</p>`;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}