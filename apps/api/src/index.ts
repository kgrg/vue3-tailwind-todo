import express from 'express'
import activitiesRouter from './routes/activities.ts'
import habitsRouter from './routes/habits.ts'
import todosRouter from './routes/todos.ts'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(express.json())

app.use('/api/activities', activitiesRouter)
app.use('/api/habits', habitsRouter)
app.use('/api/todos', todosRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`TaskFlow API running at http://localhost:${port}`)
})
