import config from "../config";
export const getPrograms = async () => {
  const response = await fetch(
    `${config.backendApiRoot}${config.apiPaths.program}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch progrms");
  return await response.json();
};
