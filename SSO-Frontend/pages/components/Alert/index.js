import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.less';


export default class Alert extends Component {
    render() {
        const {className, children, ...props} = this.props;

        return (
            <div {...props} className={classNames([styles.alert, className])}>
                {children}
            </div>
        );
    }
}
