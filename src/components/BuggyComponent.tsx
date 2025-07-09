// src/components/BuggyComponent.tsx
import React from 'react';

export class BuggyComponent extends React.Component {
  componentDidMount() {
    throw new Error('💥KABOOM!!! TEST ERROR!');
  }

  render() {
    return <div>if you see it then error didn`t work</div>;
  }
}
