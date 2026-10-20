const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello from Docker on AWS!</h1>
    <p>APP_ENV: ${process.env.APP_ENV || 'not set'}</p>
    <p>Hostname: ${os.hostname()}</p>
    <p>APP_SECRET set: ${Boolean(process.env.APP_SECRET)}</p>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// Burns CPU in 100 ms slices, yielding between them so /health keeps answering.
app.get('/load', (req, res) => {
  const seconds = Math.min(Number(req.query.seconds) || 30, 120);
  const end = Date.now() + seconds * 1000;
  (function burn() {
    const sliceEnd = Date.now() + 100;
    while (Date.now() < sliceEnd) Math.sqrt(Math.random());
    if (Date.now() < end) return setImmediate(burn);
    res.send(`Burned CPU for ${seconds}s on ${os.hostname()}`);
  })();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
