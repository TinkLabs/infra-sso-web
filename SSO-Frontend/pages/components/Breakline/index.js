import React, {Component} from 'react';
import styles from './styles.less';


export default class Breakline extends Component {
    render() {
        return (
            <div className={styles.line}>
                <span>
                    {this.props.children}
                </span>
            </div>
        );
    }
}
