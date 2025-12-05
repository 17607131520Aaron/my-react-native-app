/**
 * 组件挂载时执行
 */

import { useEffect } from 'react';

function useMount(fn: () => void) {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useMount;
