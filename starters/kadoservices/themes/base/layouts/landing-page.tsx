/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import type { LayoutProps } from '../_types.js';
import Base from './base.js';

const LandingPage: FC<LayoutProps> = (props) => {
  return (
    <Base {...props}>
      {props.children}
    </Base>
  );
};

export default LandingPage;
