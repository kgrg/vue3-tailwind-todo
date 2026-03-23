Feature: Daily Reflection & Weekly Summary
  As a user seeking to improve my productivity
  I want to reflect on my day and see my progress over time
  So that I can understand my habits and plan better in the future

  Background:
    Given the user has completed a workday using Focus OS

  # User Journey: Reflection
  Scenario: End-of-day Check-in (Happy Path)
    When the user initiates the "End of Day" flow
    Then the system should ask "What blocked you today?"
    And the system should present options like "Too many meetings", "Procrastination", "Unclear requirements"
    And the system should ask "Was Today's 5 realistic?" (Yes/No)
    When the user completes the check-in
    Then the responses should be saved for the weekly summary

  Scenario: Skipping Reflection
    When the user is prompted for the "End of Day" check-in
    And the user selects "Skip"
    Then the check-in should be dismissed
    And no data should be recorded for that day's reflection

  # Weekly Summary
  Scenario: Weekly Summary Generation
    Given it is the end of the week (e.g., Friday evening or Sunday)
    And the user has used the app for at least 3 days
    When the user opens the app
    Then the "Weekly Summary" should be available
    And the summary should show the "Completion Trend" (tasks completed vs planned)
    And the summary should show the "Most Postponed Tasks"
    And the summary should show the "Average Tasks Completed per Day"

  Scenario: Identifying Blockers in Weekly Summary
    Given the user reported "Too many meetings" as a blocker 3 times this week
    When the Weekly Summary is generated
    Then the system should highlight "Too many meetings" as the primary blocker
    And the system might suggest "Adjust your daily capacity" (Future Feature Hint)
