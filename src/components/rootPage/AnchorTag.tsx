import { Component, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface AnchorTagProps extends LinkProps {
  className: string;
  children: ReactNode;
}

class AnchorTag extends Component<AnchorTagProps> {
  render() {
    const { className, to, children, ...rest } = this.props;

    return (
      <Link className={className} to={to} {...rest}>
        {children}
      </Link>
    );
  }
}

export default AnchorTag;
