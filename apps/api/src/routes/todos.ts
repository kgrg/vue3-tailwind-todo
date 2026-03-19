import { Router } from 'express'
import { db } from '../data.ts'
import type { Todo } from '../types.ts'

const router = Router()

router.get('/', (_req, res) => {
  res.json({ todos: db.todos, lists: db.todoLists })
})

router.get('/lists', (_req, res) => {
  res.json(db.todoLists)
})

router.post('/', (req, res) => {
  const { title, listId, important, dueDate, notes } = req.body
  if (!title) {
    res.status(400).json({ error: 'Missing required field: title' })
    return
  }

  const todo: Todo = {
    id: Date.now(),
    title,
    completed: false,
    important: important ?? false,
    dueDate: dueDate ?? null,
    notes: notes ?? '',
    listId: listId ?? 'default',
    createdAt: new Date().toISOString(),
  }
  db.todos.push(todo)
  res.status(201).json(todo)
})

router.patch('/:id', (req, res) => {
  const index = db.todos.findIndex(t => t.id === Number(req.params.id))
  if (index === -1) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  const updated = { ...db.todos[index], ...req.body, id: db.todos[index].id }
  db.todos[index] = updated
  res.json(updated)
})

router.delete('/:id', (req, res) => {
  const index = db.todos.findIndex(t => t.id === Number(req.params.id))
  if (index === -1) {
    res.status(404).json({ error: 'Todo not found' })
    return
  }
  db.todos.splice(index, 1)
  res.status(204).end()
})

export default router
