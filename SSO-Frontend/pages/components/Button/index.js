import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.less';


export default class Button extends Component {
    render() {
        const { className, children, ...props} = this.props;
        const Element = props.href ? 'a' : 'button';

        return (
            <Element {...props} className={classNames([styles.button, className])}>
                {children}
            </Element>
        );
    }
}
