#!/bin/bash

# Remove old component directories
rm -rf src/components/Form
rm -rf src/components

# Remove old store files
rm -rf src/stores

# Remove old view directory
rm -rf src/views

# Remove old service files
rm -rf src/services

# Remove old type files
rm -rf src/types

# Remove old composables directory
rm -rf src/composables

# Remove old test directories that have been moved
rm -rf src/components/Form/__test__

# Remove old CSS files that have been moved
rm -f src/assets/*.css

# Remove temporary or backup files
rm -f src/modules/todo/store/todo.old.js

# Remove empty directories
find src -type d -empty -delete

echo "Cleanup completed. The following structure remains:"
tree src/ 