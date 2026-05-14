const data = [
  "ottoman",
  "Banane",
  "Orange",
  "Fraise"
];

function search() {
  const query = document
    .getElementById("search")
    .value
    .toLowerCase();

  const results = data.filter(item =>
    item.toLowerCase().includes(query)
  );

  document.getElementById("results").innerHTML =
    results.map(r => `<p>${r}</p>`).join("");
}