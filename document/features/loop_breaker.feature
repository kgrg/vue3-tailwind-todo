Feature: Postponement Loop Breaker
  As a user who struggles with procrastination
  I want the system to detect when I'm avoiding a task
  So that I can break the cycle and make progress

  Background:
    Given a task "Finish Complex Report" exists in the user's list

  # User Journey: Postponement Loop Breaker
  Scenario: Detect Chronic Postponement
    Given the task "Finish Complex Report" has been postponed 3 times
    When the Daily Plan is generated for the 4th time
    Then the system should flag "Finish Complex Report" as "Stuck"
    And the system should trigger the "Loop Breaker" intervention

  Scenario: Loop Breaker Intervention - Break Down Task
    Given the "Loop Breaker" intervention is triggered for "Finish Complex Report"
    When the system asks "Why is this stuck?"
    And the user selects "The task is too big"
    Then the system should prompt the user to break it down into subtasks
    And the user can create subtasks like "Draft Intro", "Gather Data", "Write Conclusion"
    And the original task "Finish Complex Report" should be converted to a project or parent task
    And the new subtasks should be added to the backlog

  Scenario: Loop Breaker Intervention - Delete/Archive
    Given the "Loop Breaker" intervention is triggered for "Read Old Article"
    When the system asks "Why is this stuck?"
    And the user selects "It's not important anymore"
    Then the system should suggest archiving or deleting the task
    When the user confirms "Archive"
    Then the task "Read Old Article" should be moved to the "Archive" list
    And it should no longer appear in future Daily Plans

  Scenario: Loop Breaker Intervention - Define Next Action
    Given the "Loop Breaker" intervention is triggered for "Call Client"
    When the system asks "Why is this stuck?"
    And the user selects "Unclear what to do next"
    Then the system should prompt "What is the very first step?"
    When the user enters "Find client phone number"
    Then the task "Call Client" should be updated or a new dependency task "Find client phone number" should be created
