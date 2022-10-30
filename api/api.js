async function get(path, params) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PREFACE_API_URL}/${path}${getParams(params)}`,
    {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
  if (!response.ok) {
    return handleError(response);
  }

  return response.json();
}

async function post(path, data) {
  const response = await fetch(`${process.env.PREFACE_API_URL}/${path}`, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (!response.ok) {
    return handleError(response);
  }

  return response.json();
}

async function patch(path, data) {
  const response = await fetch(`${process.env.PREFACE_API_URL}/${path}`, {
    credentials: "include",
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (!response.ok) {
    return handleError(response);
  }

  return response.json();
}

async function del(path, params) {
  const response = await fetch(
    `${process.env.PREFACE_API_URL}/${path}${getParams(params)}`,
    {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );

  if (!response.ok) {
    return handleError(response);
  }

  return response.ok;
}

function getParams(params) {
  const search = new URLSearchParams(params).toString();
  return search ? `?${search}` : "";
}

function handleError(response) {
  if (response.bodyUsed) {
    const { status, code, msg, errors } = response.json();
    console.error("API error", {
      msg,
      url: response.url,
      status,
      code,
      errors,
    });

    throw new ApiError(msg, { url, status, code, errors });
  }

  throw new Error("API Error.");
}

export { get, post, patch, del };
