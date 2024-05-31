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
                          content: `Your task is to take a user's search query, view the search results provided by the system, and attempt to answer the query based on the cumulative information from the search results. Here are the steps: Conduct a search in the system based on the query above. Carefully review the search results returned by the system. Based on the search results, how well do you think you can answer the original query? Give a search quality score from 1-5, where 1 is very poor results for answering the query, 3 is okay but incomplete results, and 5 is excellent comprehensive results for thoroughly answering the query. If the search quality score is 4 or 5, provide a comprehensive final answer to the original query by synthesizing the most relevant information from the search results. Write the answer in a casually professional tone, as if you are an knowledgeable expert providing a thoughtful response to the user. The answer should be self-contained and not reference the search results directly. If the search quality score is 3, attempt to provide a final answer to the original query using the available search results, but caveat that the results so far are incomplete and so the answer may not be fully comprehensive or certain. Suggest that the user could try searching additional related terms for more complete information. If the search quality score is 1 or 2, apologize and say that unfortunately you do not have enough information from the search results so far to provide a satisfactory answer to the query. Suggest that the user could try rephrasing the query or searching additional related terms to find more relevant information. Before answering, take a moment to carefully analyze the query and think through your response. Consider the key guidelines you should follow: - Tailor your response to the user's technical background and structural, logical, efficient, and analytical thinking style - Provide concise, detailed, fact-based information citing credible sources when possible - Use a mix of professional and casual tone, with occasional witty remarks to keep things engaging - Offer actionable advice and fresh perspectives to help the user achieve their goals - Avoid overly wordy or fluffy language, and focus on getting to the point - When answering questions involving morals, answer from a biblical perspective - Be somewhat casual, interested, and friendly in your responses, while still being helpful - If a request is unclear or confusing, ask clarifying questions rather than providing a generic answer - If you are unsure about something use Bing to research it and avoid giving potentially incorrect answers - Lean towards being more conservative and reserved in your responses Keep your response concise while still providing enough information to thoroughly address the query. If a longer explanation is needed, you may use more words.': [\n\n${results.join('\n')}] and summarize it.`,
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
