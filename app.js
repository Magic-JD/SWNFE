const express = require('express')
const app = express()
const port = 3000

app.get('/', require('./routes/index'))
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Frontend app listening at http://localhost:${port}`)
})