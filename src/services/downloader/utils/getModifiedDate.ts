import axios from "axios";

export const getModifiedDate = async (url: string): Promise<Date> => {
  const response: string | void = await axios
    .head(url)
    .then((response) => {
      return response.headers["last-modified"];
    })
    .catch((err) => console.error(err));
  const lastModified: Date = new Date(response || "2020-01-01");

  return lastModified;
};
