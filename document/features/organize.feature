Feature: Organization & Search
  As a user with a growing list of tasks
  I want to organize and find tasks easily
  So that I can manage my work without getting lost

  Background:
    Given the user has created multiple tasks

  Scenario: View tasks by list (Inbox, Today, Upcoming)
    When the user navigates to "Inbox"
    Then only tasks with status "Inbox" should be visible
    When the user navigates to "Today"
    Then only tasks assigned to today's date should be visible
    When the user navigates to "Upcoming"
    Then tasks with future due dates should be visible, sorted by date

  Scenario: Search for a task by title
    Given a task exists with the title "Prepare Q4 Budget"
    When the user enters "Budget" in the search bar
    Then the task "Prepare Q4 Budget" should appear in the results
    And tasks without "Budget" in the title or notes should not appear

  Scenario: Filter tasks by Energy Level
    Given tasks exist with "High", "Medium", and "Low" energy tags
    When the user applies the "High Energy" filter
    Then only tasks tagged with "High Energy" should be visible
    And "Low Energy" tasks should be hidden

  Scenario: Filter tasks by Estimate
    Given tasks exist with estimates of 15, 30, and 60 minutes
    When the user applies the "Short Tasks (< 30 mins)" filter
    Then only tasks with estimates of 15 minutes should be visible (assuming strict less than)
    # Note: If the filter is <= 30, then 15 and 30 would be visible. Adjusting logic to typical "Quick Wins" filter.
