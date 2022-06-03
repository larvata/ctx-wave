function onLinkClick(href) {
  if (!href) {
    return;
  }
  chrome.tabs.create({ url: href });
}

function Link(props) {
  const { href } = props;
  return (
    <a onClick={() => onLinkClick(href)} { ...props } />
  );
}

export default Link;
