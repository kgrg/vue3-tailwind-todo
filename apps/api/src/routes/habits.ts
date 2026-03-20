import { Router } from 'express'
import { db } from '../data.ts'
import type { Habit } from '../types.ts'

const router = Router()

router.get('/', (_req, res) => {
  res.json(db.habits)
})

router.get('/:id', (req, res) => {
  const habit = db.habits.find(h => h.id === Number(req.params.id))
  if (!habit) {
    res.status(404).json({ error: 'Habit not found' })
    return
  }
  res.json(habit)
})

router.post('/', (req, res) => {
  const { title, image, startTime, endTime } = req.body
  if (!title || !startTime || !endTime) {
    res.status(400).json({ error: 'Missing required fields: title, startTime, endTime' })
    return
  }

  const habit: Habit = {
    id: db.habits.length > 0 ? Math.max(...db.habits.map(h => h.id)) + 1 : 1,
    title,
    image: image ?? '',
    startTime,
    endTime,
  }
  db.habits.push(habit)
  res.status(201).json(habit)
})

router.patch('/:id', (req, res) => {
  const index = db.habits.findIndex(h => h.id === Number(req.params.id))
  if (index === -1) {
    res.status(404).json({ error: 'Habit not found' })
    return
  }
  const updated = { ...db.habits[index], ...req.body, id: db.habits[index].id }
  db.habits[index] = updated
  res.json(updated)
})

router.delete('/:id', (req, res) => {
  const index = db.habits.findIndex(h => h.id === Number(req.params.id))
  if (index === -1) {
    res.status(404).json({ error: 'Habit not found' })
    return
  }
  db.habits.splice(index, 1)
  res.status(204).end()
})

export default router
