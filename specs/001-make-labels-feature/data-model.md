# Data Model: Labels Feature

## Entities

### Label

Represents a categorization tag that can be assigned to tasks for organization and filtering.

**Fields**:

- `id: string` - Unique identifier (UUID v4)
- `name: string` - Display name (1-32 characters, case-insensitive unique)
- `color: string` - Hex color code (3 or 6 digit format, e.g., "#22c55e")

**Validation Rules**:

- Name must be 1-32 characters, trimmed whitespace
- Name must be unique (case-insensitive comparison)
- Color must be valid 3 or 6 digit hex format
- Maximum 200 labels per application instance

**State Transitions**:

- Created: New label with unique name and valid color
- Updated: Name or color changed (preserves all task associations)
- Deleted: Label removed from all tasks, label record deleted

### Task (Extended)

Existing task entity extended with label associations.

**New Fields**:

- `labelIds: string[]` - Array of label IDs assigned to this task

**Validation Rules**:

- Maximum 12 labels per task (warning at 12, block at 20)
- All labelIds must reference existing labels
- Empty array allowed (no labels assigned)

**State Transitions**:

- Label Assignment: Add labelId to array (if not already present)
- Label Removal: Remove labelId from array
- Label Deletion: Remove labelId from all tasks when label is deleted

## Relationships

### Label ↔ Task (Many-to-Many)

- One label can be assigned to multiple tasks
- One task can have multiple labels
- Relationship managed through `labelIds` array on Task entity
- Cascade delete: When label is deleted, remove from all tasks

## Data Persistence

### Storage Keys

- `labels:v1` - Array of Label entities
- `tasks` - Existing tasks array (extended with labelIds)

### Migration Strategy

- On application load, check if tasks have `labelIds` property
- If missing, initialize with empty array `[]`
- Persist updated tasks back to localStorage

### Repository Pattern

```typescript
interface LabelsRepository {
  getAll(): Promise<Label[]>
  getById(id: string): Promise<Label | null>
  create(label: Omit<Label, 'id'>): Promise<Label>
  update(id: string, updates: Partial<Label>): Promise<Label>
  delete(id: string): Promise<void>
  exists(name: string): Promise<boolean>
}

interface TasksRepository {
  updateLabelIds(taskId: string, labelIds: string[]): Promise<void>
  getTasksByLabelIds(labelIds: string[]): Promise<Task[]>
}
```

## Performance Considerations

### Computed Maps

- `labelMap: Map<string, Label>` - O(1) label lookup by ID
- `labelNameMap: Map<string, string>` - O(1) name to ID mapping
- Recompute on label changes to maintain consistency

### Filtering Optimization

- Use computed properties for label-based task filtering
- Implement debounced search (150ms) for type-ahead functionality
- Cache filter results to avoid repeated computations

## Validation Schemas

### Label Creation

```typescript
const labelSchema = z.object({
  name: z.string().min(1).max(32).trim(),
  color: z.string().regex(/^#[0-9A-Fa-f]{3,6}$/),
})
```

### Label Assignment

```typescript
const labelAssignmentSchema = z.object({
  taskId: z.string().uuid(),
  labelIds: z.array(z.string().uuid()).max(12),
})
```

## Error Handling

### Validation Errors

- Duplicate name: "A label named 'X' already exists"
- Invalid color: "Please enter a valid hex color like #AABBCC"
- Name too long: "Label name must be 32 characters or less"
- Too many labels: "Maximum 12 labels per task"

### System Errors

- Storage failure: "Unable to save labels. Please try again."
- Migration failure: "Unable to load existing tasks. Please refresh the page."
