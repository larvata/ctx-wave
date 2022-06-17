import { Button } from 'antd';
import { PAGE_URL } from '../../common/constants';
import Link from '../Link';

function LoginContent() {
  return (
    <div className="login">
      <Link className="button primary" href={PAGE_URL.LOGIN}>
        <Button type="primary">
          {browser.i18n.getMessage('UI_Login_Button')}
        </Button>
      </Link>
      <style jsx="true">
        {`
          body {
            height: 245px;
          }
          .login {
            text-align: center;
            margin: 20px;
          }
          .login .button {
            padding: 10px;
          }
        `}
      </style>
    </div>
  );
}

export default LoginContent;
