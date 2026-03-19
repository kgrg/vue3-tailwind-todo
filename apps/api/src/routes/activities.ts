import { Router } from 'express'
import { db } from '../data.ts'
import type { Activity } from '../types.ts'

const router = Router()

router.get('/', (_req, res) => {
  res.json(db.activities)
})

router.get('/:id', (req, res) => {
  const activity = db.activities.find(a => a.id === req.params.id)
  if (!activity) {
    res.status(404).json({ error: 'Activity not found' })
    return
  }
  res.json(activity)
})

router.post('/', (req, res) => {
  const { title, description, category, date, time, location } = req.body
  if (!title || !category || !date || !time) {
    res.status(400).json({ error: 'Missing required fields: title, category, date, time' })
    return
  }

  const activity: Activity = {
    id: Date.now().toString(),
    title,
    description: description ?? '',
    category,
    date,
    time,
    location,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.activities.push(activity)
  res.status(201).json(activity)
})

router.patch('/:id', (req, res) => {
  const index = db.activities.findIndex(a => a.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ error: 'Activity not found' })
    return
  }
  const updated = { ...db.activities[index], ...req.body, id: db.activities[index].id }
  db.activities[index] = updated
  res.json(updated)
})

router.delete('/:id', (req, res) => {
  const index = db.activities.findIndex(a => a.id === req.params.id)
  if (index === -1) {
    res.status(404).json({ error: 'Activity not found' })
    return
  }
  db.activities.splice(index, 1)
  res.status(204).end()
})

export default router
