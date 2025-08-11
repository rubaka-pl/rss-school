import { useEffect } from 'react';

const BuggyBottom = () => {
  useEffect(() => {
    throw new Error(
      JSON.stringify(
        {
          message: 'Error from BuggyBottom',
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
  }, []);

  return <div>Buggy Bottom Loaded</div>;
};

export default BuggyBottom;
