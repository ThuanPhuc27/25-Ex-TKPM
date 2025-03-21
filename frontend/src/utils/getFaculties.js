import config from "../config";
export const getFaculties = async () => {
  const response = await fetch(
    `${config.backendApiRoot}${config.apiPaths.faculty}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch faculties");
  //console.log("test", response.json());
  return await response.json();
};
