import React, {Component} from 'react';
import styles from './styles.less';
import classNames from 'classnames';


export default class Caption extends Component {
    render() {
        const {className, children, ...props} = this.props;

        return (
            <span {...props} className={classNames([styles.caption, className])}>
                {children}
            </span>
        );
    }
}

