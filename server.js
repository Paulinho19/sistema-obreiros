const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()
const db = new sqlite3.Database('./database.db')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS obreiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    pago BOOLEAN NOT NULL DEFAULT 0);`)
})

//buscar todos os obreiros

app.get('/obreiros', (req, res) => {
  db.all('SELECT * FROM obreiros', [], (err, rows) => {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    }
    res.json(rows);
  })
})

//adicionar obreiro

app.post('/obreiros', (req, res) => {
  const {nome, pago} = req.body;

  db.run('INSERT INTO obreiros (nome, pago) VALUES (?, ?)',[nome,pago], function (err) {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.json({id: this.lastID})
  })
})

//atualizar pagamento

app.put('/obreiros/:id/pagamento', (req, res) => {
  const {pago} = req.body;
  const {id} = req.params;

  db.run('UPDATE obreiros SET pago = ? WHERE id = ?',[pago,id], function (err) {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.json({updated: this.changes})
  })
})

//todos como não pagos

app.put('/obreiros/reset', (req, res) => {

  db.run('UPDATE obreiros SET pago = 0',[], function (err) {
    if (err) {
      res.status(500).json({error: err.message})
      return;
    }
    res.json({updated: this.changes})
  })
})

//iniciar server

const PORT = 3000
app.listen(PORT, () => {
  console.log("Servidor rodando 🚀")
})
