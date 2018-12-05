import React, {Component} from 'react';
import styles from './styles.less';
import {FiCheck} from 'react-icons/fi';


export default class Checkbox extends Component {
    render() {
        const {error, children, ...props} = this.props;

        return (
            <div>
                <label>
                    <div className={styles.control}>
                        <input {...props} type="checkbox" className={styles.input}/>
                        <div className={styles.checkbox}>
                            <FiCheck size="20px"/>
                        </div>
                    </div>
                    <div className={styles.label}>{children}</div>
                </label>
                {error && <div className={styles.error}>{error}</div>}
                {!error && <div className={styles.error}>&nbsp;</div>}
            </div>
        );
    }
}
