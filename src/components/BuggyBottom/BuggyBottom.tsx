import React from 'react';

export default class BuggyBottom extends React.Component {
  componentDidMount() {
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
  }

  render() {
    return <div>Buggy Bottom Loaded</div>;
  }
}
