const baseUrl = process.env.DOMAIN;
export const getData = async (url, header) => {
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'GET',
    headers: header
  });
  const data = await res.json();
  return data;
};