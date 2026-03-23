Feature: Daily Plan Engine
  As a user with many responsibilities
  I want the system to recommend a realistic daily plan
  So that I don't feel overwhelmed by an endless to-do list

  Background:
    Given the user has a backlog of tasks in "Inbox" and "Upcoming"
    And the user has defined their working hours (e.g., 8 hours)

  # User Journey: Capture -> Plan -> Execute (Step 2)
  Scenario: Generate a realistic daily plan (Happy Path)
    Given the user has 10 tasks in the backlog
    And the total estimated time for all tasks exceeds the user's daily capacity
    When the user clicks "Generate Daily Plan"
    Then the system should propose a "Recommended 5" list
    And the system should propose an "Optional 3" list
    And the total estimated time for "Recommended 5" should be within the user's daily capacity
    And each recommended task should have a reason (e.g., "Due today", "High priority")

  Scenario: User overrides the plan by pinning a task
    Given the system has generated a plan
    And the task "Call Mom" is in the "Optional 3" list
    When the user pins "Call Mom" to the "Recommended 5" list
    Then "Call Mom" should be moved to "Recommended 5"
    And the system should recalculate the plan to accommodate the pinned task
    And the system may move a low-priority task from "Recommended 5" to "Optional 3" to maintain capacity

  # Edge Case: Overwhelmed User
  Scenario: Capacity Warning when manual selection exceeds limits
    Given the user's daily capacity is 6 hours
    And the "Recommended 5" list already contains 5.5 hours of work
    When the user manually adds a task "Deep Work Session" (estimated 2 hours) to "Recommended 5"
    Then the system should display a "Capacity Warning"
    And the warning should state "You are 1.5 hours over your daily limit"
    But the system should allow the user to proceed (Soft Limit)

  Scenario: Explanation for recommendations
    When the plan is generated
    Then the task "Submit Payroll" in "Recommended 5" should have the reason "Due today"
    And the task "Draft Proposal" in "Recommended 5" should have the reason "High energy match for morning"

  Scenario: Deferring tasks
    Given the plan is generated
    When the user moves a task "Read Article" from "Recommended 5" to "Someday"
    Then the task status should be updated to "Someday"
    And the system should replace it with another task from the backlog if capacity allows
