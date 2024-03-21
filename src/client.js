import {
  ApolloClient,
  InMemoryCache,
  defaultDataIdFromObject,
} from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';
import { populateDynamicId } from './ApolloClientHelpers.js';

import link from './link.js';
import _ from 'lodash';
import update from 'immutability-helper';

class InMemoryCacheWrapper extends InMemoryCache {
  constructor(options) {
    super(options);
  }

  write(...options) {
    const { query, result, variables = {}, dataId } = _.first(options);

    /**
     * HACK: Since apollo client has stopped generating dynamic id for non-normalized data,
     * we are generating dynamic id for non-normalized data. DO NOT REMOVE THIS CODE
     */
    const updatedResult = populateDynamicId({
      data: result,
      operation: { query, variables, dataId },
    });

    const updatedOptions = update(options, {
      0: {
        result: {
          $set: updatedResult,
        },
      },
    });

    const response = super.write(...updatedOptions);
    return response;
  }

  /**
   * We are overriding the updateQuery method to handle errors in pagination.
   */
  updateQuery(...options) {
    return super.updateQuery(...options);
  }
}

class ApolloClientWrapper extends ApolloClient {
  constructor(options) {
    super(options);
  }

  /**
   * Aim of overriding watchQuery method is to get instance of ObservableQuery to fix some issues which are open in apollo client.
   * DO NOT MODIFY ANYTHING IN THIS METHOD WITHOUT DISCUSSION. All changes are made considering that better solution is not possible to fix these issues.
   */
  watchQuery(...options) {
    const observableQuery = super.watchQuery(...options);

    /**
     * Problem:
     * In apollo client v3, cache is more reactive than its predecessor. It can cause bad consequences, in certain scenarios.
     * So, we need to control it to stop broadcasting of cache updates.
     *
     * Solution:
     * When to render a component on cache updates is controlled by shouldNotify method of QueryInfo class.
     * Since we can't access and modify QueryInfo class, we are using a hack to access its instance from the ObservableQuery instance returned by watchQuery method.
     * Here, we are assigning a new function to shouldNotify method of queryInfo, which can execute custom logic to prevent component rendering.
     * Original implementation of shouldNotify: https://github.dev/apollographql/apollo-client/blob/69563f157b54a0cd23958a609bdf9e016a1a25e1/src/core/QueryInfo.ts#L268
     */
    if (observableQuery.queryInfo) {
      const queryInfo = observableQuery.queryInfo;

      const originalShouldNotify = queryInfo.shouldNotify.bind(queryInfo);

      queryInfo.shouldNotify = function (...args) {
        /**
         * Issue:
         * According to the current implementation of QueryInfo class, if request for 'QueryA' is in progress and cache for QueryA is updated due to some other queries/mutations,
         * then component using 'QueryA' will be reredered with networkStatus as 7. This can happen when fetchPolicy is cache-and-network or cache-only.
         * This can cause issues, while pagination request is active as component will receive networkStatus as 7, which can cause multiple duplicate paginated requests.
         *
         * Solution:
         * We are blocking component rerendering in middle of a pagination request when fetchPolicy is cache-and-network.
         **/
        if (
          this.observableQuery &&
          this.observableQuery.options.fetchPolicy === 'cache-and-network' &&
          this.networkStatus === 3
        ) {
          // Uncomment below code to see how many times this hack is preventing rendering of component in middle of a paginated request.
          // To see the logs for particular requests only, use its variables such that below condition is satisfied only for those requests.

          // if (this.observableQuery.options.variables?.filters?.first) {
          //   console.log(
          //     "%c Prevented rendering in middle of a request",
          //     "color:red;font-size:20px;"
          //   );
          // }
          return false;
        }

        /**
         * Issue:
         * In apollo client v3, whenever cache is updated with incomplete data, it rerenders corresponding components.
         * This is problematic as it is difficult to make sure that every query is updated with complete data in the cache.
         *
         * Solution:
         * Ideally, this can be solved by "nextFetchPolicy", but since it is buggy, we can't rely on it.
         * So, we are adding a HACK to handle this case. Here, "dirty" is a flag which is set to true whenever cache is updated and
         * "complete" is a flag which is set to false whenever cache is updated with incomplete data.
         */
        const dirty = this.dirty;
        const complete = _.get(this, 'lastDiff.diff.complete', true);

        if (dirty && !complete) {
          const query = _.get(
            this,
            'lastDiff.options.query.loc.source.body',
            '',
          );
          const optimistic = _.get(this, 'lastDiff.options.optimistic', false);

          console.warn(
            `Due to ${
              optimistic ? 'optimistic' : ''
            } cache update, cache has incomplete data for the following query`,
          );
          console.warn(`Query: ${query}`);

          console.warn(
            `Status of missing cached data for above query::`,
            _.get(this, 'lastDiff.diff.missing'),
          );

          return false;
        }

        return originalShouldNotify(...args);
      };
    }

    if (observableQuery.fetchMore) {
      const originalFetchMore = observableQuery.fetchMore.bind(observableQuery);

      /**
       * Issue: While pagination request for query 'QueryA' is active, if same query is triggered with different variables('QueryB'),
       * then when response of 'QueryA' is received, it is merged with the cached data corresponding to the 'QueryB', which should not happen.
       * This is likely to happen where we support paginated query with filters.
       *
       * Solution: Issue is happening because variables of Observable query are mutated, when same query is triggered with different variables.
       * So, we are storing original variables in a separate variable and then comparing it with current variables in updateQuery method to decide whether to update cache or not.
       * Solution is inspired after analyzing the source code of apollo client: https://github.dev/apollographql/apollo-client/blob/e9fd314f325300d7c5f979fbef719aee498481b2/src/core/ObservableQuery.ts#L503
       *
       * Note: This issue does not happen for normal queries. It is specific to pagination.
       */
      observableQuery.fetchMore = function (...args) {
        const that = this;
        const variables = this.variables;

        const [fetchMoreArguments] = args;

        if (fetchMoreArguments?.updateQuery) {
          const originalUpdateQuery =
            fetchMoreArguments.updateQuery.bind(fetchMoreArguments);

          fetchMoreArguments.updateQuery = function (...args) {
            if (!_.isEqual(that.variables, variables)) {
              return;
            }

            return originalUpdateQuery(...args);
          };
        }

        return originalFetchMore(...args);
      };
    }

    return observableQuery;
  }
}

const dataIdFromObject = (object) => {
  switch (object.__typename) {
    // case 'AdditionalDetailsByBook':
    //   return null;
    default:
      return defaultDataIdFromObject(object); // fall back to default handling
  }
};

const typePolicies = {
  Book: {
    fields: {
      additionalDetailsByBook: {
        merge(existing, incoming = [], { mergeObjects }) {
          if (!existing) {
            return incoming;
          }

          const data = incoming.map((item, index) =>
            mergeObjects(item, existing?.[index] ?? {}),
          );

          return data;
        },
      },
    },
  },
};

const client = new ApolloClientWrapper({
  cache: new InMemoryCacheWrapper({
    dataIdFromObject,
    // typePolicies,
  }),
  link,
});

export default client;
