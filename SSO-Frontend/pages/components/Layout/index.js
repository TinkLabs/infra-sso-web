import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.less';


export class Container extends Component {
    static defaultProps = {
        component: 'div',
    };

    render() {
        const {component: Element, className, children, ...props} = this.props;

        return (
            <Element {...props} className={classNames([styles.container, className])}>
                {children}
            </Element>
        );
    }
}


export class Content extends Component {
    render() {
        const {className, children} = this.props;

        return (
            <div className={classNames([styles.content, styles.row, className])}>
                <div>
                    {children}
                </div>
            </div>
        );
    }
}


export class Header extends Component {
    render() {
        const {className, children} = this.props;

        return (
            <div className={classNames([styles.header, styles.row, className])}>
                <div>
                    {children}
                </div>
            </div>
        );
    }
}


export class Footer extends Component {
    render() {
        const {className, children} = this.props;

        return (
            <div className={classNames([styles.footer, styles.row, className])}>
                <div>
                    {children}
                </div>
            </div>
        );
    }
}
