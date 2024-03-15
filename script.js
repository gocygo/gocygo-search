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
                        content: `take in the context of these search results: [\n\n${results.join('\n')}] and summarize it for me please.`,
                    },
                    {
                        role: 'user',
                        content: `summarize the search results for "${query}"`
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