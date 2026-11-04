import axios from "axios";

const createSquadClient = () => {
  const baseURL = process.env.SQUAD_BASE_URL;
  const secretKey = process.env.SQUAD_SECRET_KEY;

  if (!baseURL || !secretKey) {
    throw new Error(
      "Squad payment configuration is missing SQUAD_BASE_URL or SQUAD_SECRET_KEY"
    );
  }

  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });
};

export default createSquadClient;
