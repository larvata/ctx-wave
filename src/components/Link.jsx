function onLinkClick(href) {
  if (!href) {
    return;
  }
  browser.tabs.create({ url: href });
}

function Link(props) {
  const { href } = props;
  return (
    <a onClick={() => onLinkClick(href)} { ...props } />
  );
}

export default Link;
