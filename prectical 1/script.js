
const votes = {
  JavaScript: 0,
  Python: 0,
  Java: 0
};


function vote(language) {
  votes[language]++;
  updateVotes();
}


function updateVotes() {
  for (const language in votes) {
    document.getElementById(language).textContent = votes[language];
  }
}


setInterval(() => {
  const langs = Object.keys(votes);
  const randomLang = langs[Math.floor(Math.random() * langs.length)];
  votes[randomLang]++;
  updateVotes();
}, 2000);
