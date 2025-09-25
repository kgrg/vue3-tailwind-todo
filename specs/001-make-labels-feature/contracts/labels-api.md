# Labels API Contracts

## Label Management API

### Create Label

**Endpoint**: `POST /api/labels`
**Description**: Create a new label with name and color

**Request**:

```typescript
interface CreateLabelRequest {
  name: string // 1-32 characters, unique
  color: string // Valid hex color (#RGB or #RRGGBB)
}
```

**Response**:

```typescript
interface CreateLabelResponse {
  id: string // Generated UUID
  name: string // Trimmed name
  color: string // Normalized hex color
  createdAt: string // ISO timestamp
}
```

**Error Responses**:

- `400 Bad Request`: Invalid name or color format
- `409 Conflict`: Label name already exists
- `422 Unprocessable Entity`: Validation failed

### Get All Labels

**Endpoint**: `GET /api/labels`
**Description**: Retrieve all labels

**Response**:

```typescript
interface GetLabelsResponse {
  labels: Label[]
  total: number
}
```

### Update Label

**Endpoint**: `PUT /api/labels/:id`
**Description**: Update existing label name or color

**Request**:

```typescript
interface UpdateLabelRequest {
  name?: string // Optional new name
  color?: string // Optional new color
}
```

**Response**:

```typescript
interface UpdateLabelResponse {
  id: string
  name: string
  color: string
  updatedAt: string // ISO timestamp
}
```

### Delete Label

**Endpoint**: `DELETE /api/labels/:id`
**Description**: Delete label and remove from all tasks

**Response**:

```typescript
interface DeleteLabelResponse {
  id: string
  deletedAt: string // ISO timestamp
  affectedTasks: number // Count of tasks that had this label
}
```

## Task-Label Association API

### Assign Labels to Task

**Endpoint**: `PUT /api/tasks/:id/labels`
**Description**: Assign multiple labels to a task

**Request**:

```typescript
interface AssignLabelsRequest {
  labelIds: string[] // Array of label IDs (max 12)
}
```

**Response**:

```typescript
interface AssignLabelsResponse {
  taskId: string
  labelIds: string[]
  updatedAt: string
}
```

### Remove Labels from Task

**Endpoint**: `DELETE /api/tasks/:id/labels`
**Description**: Remove specific labels from a task

**Request**:

```typescript
interface RemoveLabelsRequest {
  labelIds: string[] // Array of label IDs to remove
}
```

**Response**:

```typescript
interface RemoveLabelsResponse {
  taskId: string
  remainingLabelIds: string[]
  updatedAt: string
}
```

### Get Tasks by Labels

**Endpoint**: `GET /api/tasks?labels=:labelIds&operator=:op`
**Description**: Filter tasks by label IDs

**Query Parameters**:

- `labels`: Comma-separated label IDs
- `operator`: "AND" or "OR" (default: "OR")

**Response**:

```typescript
interface GetTasksByLabelsResponse {
  tasks: Task[]
  total: number
  appliedFilters: {
    labelIds: string[]
    operator: 'AND' | 'OR'
  }
}
```

## Local Storage Contracts

### Labels Storage

**Key**: `labels:v1`
**Format**: Array of Label objects

```typescript
interface StoredLabels {
  version: 'v1'
  labels: Label[]
  lastUpdated: string
}
```

### Tasks Storage (Extended)

**Key**: `tasks`
**Format**: Array of Task objects with labelIds

```typescript
interface StoredTasks {
  tasks: Task[]
  lastUpdated: string
}

interface Task {
  id: string
  title: string
  // ... existing task fields
  labelIds: string[] // New field for label associations
}
```

## Validation Rules

### Label Name Validation

- Required: Yes
- Min length: 1 character
- Max length: 32 characters
- Uniqueness: Case-insensitive
- Trimmed: Yes
- Pattern: No special characters

### Label Color Validation

- Required: Yes
- Format: Hex color (#RGB or #RRGGBB)
- Pattern: `^#[0-9A-Fa-f]{3,6}$`
- Examples: `#f00`, `#ff0000`

### Label Assignment Validation

- Max labels per task: 12 (warning), 20 (block)
- All labelIds must exist
- No duplicate labelIds in assignment

## Error Codes

### Validation Errors

- `LABEL_NAME_REQUIRED`: Label name is required
- `LABEL_NAME_TOO_LONG`: Label name exceeds 32 characters
- `LABEL_NAME_DUPLICATE`: Label name already exists
- `LABEL_COLOR_INVALID`: Invalid hex color format
- `TOO_MANY_LABELS`: Task exceeds maximum label limit

### System Errors

- `STORAGE_ERROR`: Local storage operation failed
- `MIGRATION_ERROR`: Data migration failed
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Label or task not found
