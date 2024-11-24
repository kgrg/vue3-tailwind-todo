#!/bin/bash

# Create new directory structure
mkdir -p src/{assets/styles/themes,modules/todo/{__tests__,components/{form,list},services,store,types,views},shared/{components/{__tests__,base,layout},composables,constants,services/{api,storage},utils},i18n/locales,types}

# Create storage service
mkdir -p src/shared/services/storage
cat > src/shared/services/storage/index.ts << 'EOL'
import type { Todo } from '@/modules/todo/types/todo'

const STORAGE_KEY = 'todos'

export class StorageError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'StorageError'
  }
}

export const StorageService = {
  getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      throw new StorageError(
        'Failed to load todos from storage',
        'STORAGE_READ_ERROR'
      )
    }
  },

  saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      throw new StorageError(
        'Failed to save todos to storage',
        'STORAGE_WRITE_ERROR'
      )
    }
  }
}
EOL

# Ensure types directory exists and create todo types
mkdir -p src/modules/todo/types
cat > src/modules/todo/types/todo.ts << 'EOL'
export interface Todo {
  id: number
  name: string
  description: string
  status: string
  createdDate: string
  lastModifiedDate: string
}

export interface TodoColumn {
  key: keyof Todo
  label: string
}

export interface TodoState {
  todos: Todo[]
  isLoading: boolean
  error: string | null
}
EOL

# Move components to their new locations
# Todo Module Components
mv src/components/Form/TodoForm.vue src/modules/todo/components/form/
mv src/components/Form/TodoInput.vue src/modules/todo/components/form/
mv src/components/Form/TodoTextBox.vue src/modules/todo/components/form/
mv src/components/Form/TodoDropdown.vue src/modules/todo/components/form/
mv src/components/TodoHeader.vue src/modules/todo/components/
mv src/components/TodoActionBar.vue src/modules/todo/components/
mv src/components/DataTable.vue src/modules/todo/components/list/

# Move tests
mv src/components/Form/__test__/* src/modules/todo/components/form/__tests__/

# Move shared components
mv src/components/BaseModal.vue src/shared/components/base/

# Move views
mv src/views/HomePage.vue src/modules/todo/views/

# Move services and stores
mv src/services/storage.service.ts src/shared/services/storage/
mv src/stores/todo.ts src/modules/todo/store/
mv src/stores/todo.js src/modules/todo/store/todo.old.js

# Move types
mv src/types/todo.ts src/modules/todo/types/

# Move composables
mv src/composables/useFocusTrap.ts src/shared/composables/

# Move styles
mv src/assets/base.css src/assets/styles/
mv src/assets/main.css src/assets/styles/

# Create theme files (empty for now)
touch src/assets/styles/themes/light.css
touch src/assets/styles/themes/dark.css

# Update imports in moved files
find src -type f -name "*.vue" -o -name "*.ts" -o -name "*.js" | while read file; do
  # Update import paths
  sed -i '' 's|@/components/Form/|@/modules/todo/components/form/|g' "$file"
  sed -i '' 's|@/components/|@/shared/components/|g' "$file"
  sed -i '' 's|@/stores/todo|@/modules/todo/store/todo|g' "$file"
  sed -i '' 's|@/services/|@/shared/services/|g' "$file"
  sed -i '' 's|@/types/todo|@/modules/todo/types/todo|g' "$file"
  sed -i '' 's|@/composables/|@/shared/composables/|g' "$file"
  sed -i '' 's|@/views/|@/modules/todo/views/|g' "$file"
done

# Create index files for better module organization
echo "export * from './todo'" > src/modules/todo/store/index.ts
echo "export * from './todo'" > src/modules/todo/types/index.ts

# Update vite config to ensure @ alias still works
sed -i '' "s|'./src'|'./src'|g" vite.config.js

echo "Migration completed. Please verify all imports and run the application to ensure everything works correctly." 