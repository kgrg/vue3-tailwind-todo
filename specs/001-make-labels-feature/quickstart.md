# Quickstart: Labels Feature

## Overview

This guide demonstrates the complete labels functionality through user scenarios and validation steps.

## Prerequisites

- Vue 3 + TypeScript application running
- Pinia store configured
- Tailwind CSS styling
- localStorage available

## User Scenarios

### Scenario 1: Create and Manage Labels

**Steps**:

1. Navigate to Labels management page
2. Click "Create New Label" button
3. Enter label name: "Work"
4. Select color: "#22c55e" (green)
5. Click "Save"
6. Verify label appears in labels list with correct name and color

**Expected Result**: Label created successfully and visible in management interface.

### Scenario 2: Assign Labels to Tasks

**Steps**:

1. Open task editor for any existing task
2. Click on label assignment field
3. Select "Work" label from dropdown
4. Add second label "Urgent" (create if needed)
5. Save task
6. Verify task shows both labels as colored chips

**Expected Result**: Task displays assigned labels as colored chips with proper styling.

### Scenario 3: Filter Tasks by Labels

**Steps**:

1. Navigate to task list view
2. Open label filter dropdown
3. Select "Work" label filter
4. Verify only tasks with "Work" label are displayed
5. Add "Urgent" label to filter (AND mode)
6. Verify only tasks with both labels are shown

**Expected Result**: Task list filtered correctly by selected labels.

### Scenario 4: Edit Existing Label

**Steps**:

1. Go to labels management page
2. Click "Edit" on "Work" label
3. Change name to "Work Tasks"
4. Change color to "#3b82f6" (blue)
5. Save changes
6. Verify label updated everywhere (task chips, filters)

**Expected Result**: Label changes reflected across all task displays and filters.

### Scenario 5: Delete Label with Confirmation

**Steps**:

1. Go to labels management page
2. Click "Delete" on a label that's assigned to tasks
3. Review confirmation dialog showing affected task count
4. Confirm deletion
5. Verify label removed from all tasks
6. Verify label no longer appears in filters

**Expected Result**: Label deleted and removed from all associated tasks.

## Validation Checklist

### Functional Validation

- [ ] Can create labels with unique names and colors
- [ ] Can edit existing labels without losing task associations
- [ ] Can delete labels with proper confirmation
- [ ] Can assign multiple labels to tasks (up to 12)
- [ ] Can filter tasks by single or multiple labels
- [ ] Can toggle between OR and AND filter logic
- [ ] All changes persist across browser reloads

### Performance Validation

- [ ] Label operations complete in <200ms
- [ ] Filtering remains responsive with 2,000 tasks
- [ ] UI maintains 60fps during interactions
- [ ] Type-ahead search debounced to 150ms
- [ ] No memory leaks during extended use

### Accessibility Validation

- [ ] All label interactions accessible via keyboard
- [ ] Screen reader announces label operations correctly
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Focus indicators visible on all interactive elements
- [ ] ARIA labels provide clear context

### Error Handling Validation

- [ ] Duplicate label names show appropriate error
- [ ] Invalid color codes rejected with helpful message
- [ ] Storage failures handled gracefully
- [ ] Network errors don't break functionality
- [ ] Validation errors clear when fixed

## Test Data Setup

### Sample Labels

```json
[
  { "id": "1", "name": "Work", "color": "#22c55e" },
  { "id": "2", "name": "Personal", "color": "#3b82f6" },
  { "id": "3", "name": "Urgent", "color": "#ef4444" },
  { "id": "4", "name": "Learning", "color": "#8b5cf6" }
]
```

### Sample Tasks with Labels

```json
[
  {
    "id": "task-1",
    "title": "Complete project proposal",
    "labelIds": ["1", "3"]
  },
  {
    "id": "task-2",
    "title": "Read Vue 3 documentation",
    "labelIds": ["4"]
  },
  {
    "id": "task-3",
    "title": "Buy groceries",
    "labelIds": ["2"]
  }
]
```

## Troubleshooting

### Common Issues

1. **Labels not persisting**: Check localStorage permissions and available space
2. **Filter not working**: Verify labelIds array exists on tasks
3. **Performance issues**: Check for memory leaks in computed properties
4. **Accessibility problems**: Verify ARIA labels and keyboard navigation

### Debug Steps

1. Open browser DevTools
2. Check localStorage for `labels:v1` and `tasks` keys
3. Verify Pinia store state in Vue DevTools
4. Test keyboard navigation with Tab key
5. Run accessibility audit with axe-core

## Success Criteria

- All user scenarios complete without errors
- Performance targets met consistently
- Accessibility compliance verified
- Data persistence working reliably
- Error handling provides clear feedback
