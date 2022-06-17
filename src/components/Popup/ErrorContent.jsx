import { Button } from 'antd';
import { PAGE_URL } from '../../common/constants';
import Link from '../Link';

function ErrorContent(props) {
  let content = null;

  if (props.showLogin) {
    content = (
      <Link className="button primary" href={PAGE_URL.LOGIN}>
        <Button type="primary">
          {browser.i18n.getMessage('UI_Login_Button')}
        </Button>
      </Link>
    );
  } else if (props.showHome) {
    content = (
      <React.Fragment>
        <span>{browser.i18n.getMessage('UI_Manage_Timeline')}</span>
        <Link className="button primary" href={PAGE_URL.HOME}>
          <Button type="primary">
            {browser.i18n.getMessage('UI_Home_Button')}
          </Button>
        </Link>
      </React.Fragment>
    );
  }
  return (
    <div className="error-content">
      {content}
      <style jsx="true">
        {`
          body {
            height: 245px;
          }
          .error-content {
            text-align: center;
            margin: 20px;
          }
          .error-content .button {
            padding: 10px;
          }
        `}
      </style>
    </div>
  );
}

export default ErrorContent;
