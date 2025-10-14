/**
 *
 * WithLoading
 *
 */
import * as React from 'react';

import Loading from '@/components/sharedV2/Loading';

export function withLoading(WrappedComponent: React.ElementType) {
  function HOC(props: any) {
    const [loading, setLoading] = React.useState(false);

    return (
      <>
        {loading && <Loading />}
        {
          //@ts-ignore
          <WrappedComponent {...props} setLoading={setLoading} />
        }
      </>
    );
  }
  return HOC;
}
