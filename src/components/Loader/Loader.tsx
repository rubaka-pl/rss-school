import { Component } from 'react';
import styles from './Loader.module.css';

export default class Loader extends Component {
  render() {
    return <span className={styles.loader} />;
  }
}
