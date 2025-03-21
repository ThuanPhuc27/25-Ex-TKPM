import config from "../config";
export const getStudentStatuses = async () => {
  const response = await fetch(
    `${config.backendApiRoot}${config.apiPaths.studentStatus}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch studentStatus");
  return await response.json();
};
