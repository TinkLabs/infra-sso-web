import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.less';


export default class Input extends Component {
    render() {
        const {append, prepend, error, ...props} = this.props;

        return (
            <div className={styles.wrapper}>
                <div className={classNames([styles.container])}>
                    {append && <div className={styles.append}>{append}</div>}
                    <input className={styles.input} {...props}/>
                    {prepend && <div className={styles.prepend}>{prepend}</div>}
                </div>
                {error && <div className={styles.error}>{error}</div>}
                {!error && <div className={styles.error}>&nbsp;</div>}
            </div>
        );
    }
}
