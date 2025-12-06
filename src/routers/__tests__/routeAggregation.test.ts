/**
 * Property-based tests for route aggregation
 * **Feature: cross-module-navigation, Property 4: Route aggregation completeness**
 * **Validates: Requirements 2.2**
 */

import * as fc from 'fast-check';

import { engineerRoutes } from '../engineer';
import { getAllRoutes, getTabHomeRoutes } from '../index';
import { institutionRoutes } from '../institution';
import { mineRoutes } from '../mine';

import type { IRouteConfig } from '../types';

// Configure fast-check to run 100 iterations
fc.configureGlobal({ numRuns: 100 });

describe('Route Aggregation', () => {
  /**
   * Property 4: Route aggregation completeness
   * *For any* route defined in any module's route configuration,
   * that route SHALL be present in the aggregated route list returned by getAllRoutes()
   * (excluding tab home pages).
   */
  describe('Property 4: Route aggregation completeness', () => {
    const allModuleRoutes: IRouteConfig[] = [
      ...engineerRoutes,
      ...institutionRoutes,
      ...mineRoutes,
    ];

    const nonTabHomeRoutes = allModuleRoutes.filter((route) => !route.isTabHome);
    const tabHomeRoutes = allModuleRoutes.filter((route) => route.isTabHome);

    it('should include all non-tab-home routes from all modules', () => {
      const aggregatedRoutes = getAllRoutes();

      // For any non-tab-home route in any module, it should be in aggregated routes
      fc.assert(
        fc.property(fc.constantFrom(...nonTabHomeRoutes), (route: IRouteConfig) => {
          const found = aggregatedRoutes.some((r) => r.name === route.name);
          return found;
        }),
        { numRuns: Math.max(nonTabHomeRoutes.length, 1) },
      );
    });

    it('should exclude all tab-home routes from aggregated routes', () => {
      const aggregatedRoutes = getAllRoutes();

      // For any tab-home route, it should NOT be in aggregated routes
      if (tabHomeRoutes.length > 0) {
        fc.assert(
          fc.property(fc.constantFrom(...tabHomeRoutes), (route: IRouteConfig) => {
            const found = aggregatedRoutes.some((r) => r.name === route.name);
            return !found; // Should NOT be found
          }),
          { numRuns: tabHomeRoutes.length },
        );
      }
    });

    it('should return correct count of non-tab-home routes', () => {
      const aggregatedRoutes = getAllRoutes();
      expect(aggregatedRoutes).toHaveLength(nonTabHomeRoutes.length);
    });

    it('getTabHomeRoutes should return tab home routes for each module', () => {
      const tabHomes = getTabHomeRoutes();

      // Check that each module's tab home is correctly identified
      const engineerTabHome = engineerRoutes.find((r) => r.isTabHome);
      const institutionTabHome = institutionRoutes.find((r) => r.isTabHome);
      const mineTabHome = mineRoutes.find((r) => r.isTabHome);

      expect(tabHomes.engineer).toEqual(engineerTabHome);
      expect(tabHomes.institution).toEqual(institutionTabHome);
      expect(tabHomes.mine).toEqual(mineTabHome);
    });
  });
});
