import React from 'react';
import styles from './Button.module.css';
import type { ButtonProps } from '../../types/app';

export default class Button extends React.Component<ButtonProps> {
  render() {
    const { onClick, children } = this.props;
    return (
      <button type="button" className={styles.button} onClick={onClick}>
        {children}
      </button>
    );
  }
}
