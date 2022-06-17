function setGlobalVariables() {
  globalThis.browser = globalThis.chrome || globalThis.browser;
}

async function fetchJSON(url, options) {
  const result = {
    success: false,
  };

  try {
    const res = await fetch(url, options);

    const json = await res.json();
    const { status } = res;
    result.status = status;
    if (status !== 200) {
      result.message = json.message;
      return result;
    }

    return {
      data: json,
      success: true,
    };
  } catch (e) {
    result.message = e.message;
    return result;
  }
}

function promisify(func) {
  return (...options) => new Promise((resolve, reject) => {
    // TODO handle reject()
    func.call(func, ...options, (results) => {
      resolve(results);
    });
  });
}

export {
  promisify,
  fetchJSON,
  setGlobalVariables,
};
