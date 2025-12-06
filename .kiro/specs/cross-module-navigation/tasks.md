# Implementation Plan

- [x] 1. Update route types and interfaces

  - [x] 1.1 Update IRootStackParamList to include MainTabs and all pages
    - Add MainTabs as a screen in root stack
    - Move all page routes from module stacks to root stack
    - _Requirements: 2.2, 4.1, 4.2, 4.3_
  - [x] 1.2 Add IRouteConfig interface with isTabHome flag
    - Define unified route configuration interface
    - Add isTabHome boolean to distinguish tab home pages
    - _Requirements: 2.1_
  - [x] 1.3 Update IMainTabParamList for tab-only navigation
    - Define tab names without nested stack params
    - _Requirements: 3.1_

- [x] 2. Refactor module route configurations

  - [x] 2.1 Update engineer.ts route config
    - Mark EngineerHome with isTabHome: true
    - Ensure all routes use IRouteConfig interface
    - _Requirements: 2.1, 2.3_
  - [x] 2.2 Update institution.ts route config
    - Mark InstitutionHome with isTabHome: true
    - Ensure all routes use IRouteConfig interface
    - _Requirements: 2.1, 2.3_
  - [x] 2.3 Update mine.ts route config
    - Mark MineHome with isTabHome: true
    - Ensure all routes use IRouteConfig interface
    - _Requirements: 2.1, 2.3_
  - [x] 2.4 Write property test for route aggregation
    - **Property 4: Route aggregation completeness**
    - **Validates: Requirements 2.2**

- [x] 3. Implement route aggregation functions

  - [x] 3.1 Create getAllRoutes function in routers/index.tsx
    - Aggregate routes from all modules
    - Filter out isTabHome routes
    - _Requirements: 2.2_
  - [x] 3.2 Create getTabHomeRoutes function
    - Return map of module key to home route config
    - _Requirements: 3.1_

- [x] 4. Update navigation utilities

  - [x] 4.1 Add navigationRef to navigation.ts
    - Create global navigation container ref
    - Export for use in NavigationContainer
    - _Requirements: 1.1, 1.2_
  - [x] 4.2 Update navigateTo function to use navigationRef
    - Remove navigation parameter dependency
    - Add isReady check before navigation
    - _Requirements: 1.1, 4.1_
  - [x] 4.3 Add goBack and resetTo helper functions
    - Implement goBack with canGoBack check
    - Implement resetTo for stack reset
    - _Requirements: 1.3, 3.3_
  - [x] 4.4 Write property test for back navigation
    - **Property 3: Back navigation round-trip**
    - **Validates: Requirements 1.3**

- [x] 5. Create MainTabs component

  - [x] 5.1 Create MainTabs.tsx in src/app/
    - Implement Tab Navigator with role-based tabs
    - Use getTabHomeRoutes for tab components
    - _Requirements: 3.1, 3.2_
  - [x] 5.2 Update tabConfigs.ts to add moduleKey
    - Add moduleKey to ITabConfig interface
    - Update tab configurations with module keys
    - _Requirements: 3.1_

- [x] 6. Refactor App entry component

  - [x] 6.1 Update src/app/index.tsx with new architecture
    - Create RootStack Navigator
    - Add MainTabs as first screen
    - Dynamically register all routes from getAllRoutes
    - Pass navigationRef to NavigationContainer
    - _Requirements: 1.1, 2.2, 5.1, 5.2_
  - [x] 6.2 Configure screen options for proper animations
    - Set slide_from_right for forward navigation
    - Hide header for MainTabs screen
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 6.3 Write property test for navigation history
    - **Property 2: Navigation history integrity**
    - **Validates: Requirements 1.2**

- [x] 7. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Clean up and remove old code

  - [x] 8.1 Remove old Stack Navigator exports from routers/index.tsx
    - Remove EngineerHomeScreen, InstitutionHomeScreen, MineScreen
    - Keep route config exports
    - _Requirements: 2.1_
  - [x] 8.2 Update any imports in existing pages
    - Update navigation usage to use new navigateTo
    - Remove old navigation patterns
    - _Requirements: 1.1_

- [x] 9. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
