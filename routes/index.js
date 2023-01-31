module.exports = (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/style.css">
        <link href="https://fonts.googleapis.com/css2?family=SciFi&display=swap" rel="stylesheet">
      </head>
      <body>
        <div id="title">SWN Generator</div>
        <div style="display: flex; justify-content: center;">
            <button id="beast-button">Beast</button>
            <button id="standard-npc-button">NPC</button>
            <button id="patron-button">Patron</button>
            <button id="world-button">World</button>
            <button id="wild-encounter-button">Wild Encounter</button>
            <button id="urban-encounter-button">Urban Encounter</button>
        </div>
        <div id="display"></div>
        <script src="/index.js"></script>
      </body>
    </html>
  `)
}