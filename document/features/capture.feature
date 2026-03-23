Feature: Rapid Task Capture
  As an overwhelmed professional
  I want to capture tasks quickly with minimal friction
  So that I can get them out of my head without losing focus

  Background:
    Given the user is logged into Focus OS
    And the user is on the "Inbox" or "Today" view

  # User Journey: Capture -> Plan -> Execute (Step 1)
  Scenario: Quick Add a task with title only
    When the user selects "Add Task"
    And enters the title "Review Q3 Report"
    And presses "Enter"
    Then a new task "Review Q3 Report" should be created in the "Inbox"
    And the task creation time should be recorded
    And the task status should be "Inbox"

  Scenario: Add a task with details (estimate and energy)
    When the user creates a task "Write Blog Post"
    And sets the estimate to "60 minutes"
    And sets the energy level to "High"
    Then the task "Write Blog Post" should be created
    And the task should have an estimate of 60 minutes
    And the task should be tagged with "High Energy"

  Scenario: Add a task with a due date
    When the user creates a task "Submit Tax Return"
    And sets the due date to "Next Friday"
    Then the task "Submit Tax Return" should be created
    And the due date should be set to the correct date
    And the task should be visible in the "Upcoming" list

  Scenario: Add a task from an external link (Integration Simulation)
    When the user pastes a link "https://github.com/org/repo/issues/123" into the task input
    And enters the title "Fix Issue #123"
    Then a new task "Fix Issue #123" should be created
    And the source link should be "https://github.com/org/repo/issues/123"
    And the source type should be identified (e.g., "GitHub")

  # Edge Case: Offline Capture
  Scenario: Capture task while offline
    Given the user has lost internet connection
    When the user creates a task "Buy Milk"
    Then the task "Buy Milk" should be saved locally
    And the task should be synced to the server when the connection is restored
