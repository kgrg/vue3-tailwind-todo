#!/bin/bash

# Create necessary directories if they don't exist
mkdir -p src/core/components
mkdir -p src/core/icons
mkdir -p src/modules/tasks/components
mkdir -p src/modules/tasks/store
mkdir -p src/modules/tasks/types
mkdir -p src/modules/tasks/services

# Move common components to core
mv src/components/common/* src/core/components/ 2>/dev/null || true

# Move icons to core
mv src/components/icons/* src/core/icons/ 2>/dev/null || true

# Move task components to tasks module
mv src/components/tasks/* src/modules/tasks/components/ 2>/dev/null || true

# Move TodoList to tasks module
mv src/components/TodoList.vue src/modules/tasks/components/ 2>/dev/null || true

# Move stores to their respective modules
if [ -d "src/stores" ]; then
  for store in src/stores/*; do
    if [ -f "$store" ]; then
      filename=$(basename "$store")
      if [[ $filename == *"habit"* ]]; then
        mv "$store" src/modules/habits/store/ 2>/dev/null || true
      elif [[ $filename == *"task"* ]]; then
        mv "$store" src/modules/tasks/store/ 2>/dev/null || true
      fi
    fi
  done
fi

# Move views to their respective modules
if [ -d "src/views" ]; then
  for view in src/views/*; do
    if [ -f "$view" ]; then
      filename=$(basename "$view")
      if [[ $filename == *"Habit"* ]]; then
        mv "$view" src/modules/habits/views/ 2>/dev/null || true
      elif [[ $filename == *"Task"* ]]; then
        mv "$view" src/modules/tasks/views/ 2>/dev/null || true
      fi
    fi
  done
fi

# Move style.css to styles directory
mv src/style.css src/styles/main.css 2>/dev/null || true

# Clean up empty directories
find src -type d -empty -delete

# Update main.js style import
sed -i '' 's/import .\/style.css/import .\/styles\/main.css/' src/main.js

echo "Cleanup completed!" 