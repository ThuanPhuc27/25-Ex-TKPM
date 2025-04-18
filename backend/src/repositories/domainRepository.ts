import fs from "fs";
import path from "path";

const domainPath = path.join(__dirname, "../data/domain-local.json");
const domainInitPath = path.join(__dirname, "../data/domain-init.json");

export const getDomains = (): string[] => {
  try {
    const data = fs.readFileSync(domainPath, "utf-8");
    const { ALLOWED_EMAIL_DOMAINS } = JSON.parse(data);
    return Array.isArray(ALLOWED_EMAIL_DOMAINS) ? ALLOWED_EMAIL_DOMAINS : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If domain-local.json is not found, attempt to load domain-init.json
      try {
        const initData = fs.readFileSync(domainInitPath, "utf-8");
        const { ALLOWED_EMAIL_DOMAINS } = JSON.parse(initData);
        // Write the initial data to domain-local.json
        fs.writeFileSync(domainPath, initData, "utf-8");
        return Array.isArray(ALLOWED_EMAIL_DOMAINS)
          ? ALLOWED_EMAIL_DOMAINS
          : [];
      } catch (initError) {
        throw new Error("Error reading domain-init.json");
      }
    }
    throw new Error("Error reading domain-local.json");
  }
};

// Cập nhật danh sách email domains
export const updateDomains = (newDomains: string[]): string[] => {
  try {
    if (!Array.isArray(newDomains)) {
      throw new Error("Invalid data format");
    }
    fs.writeFileSync(
      domainPath,
      JSON.stringify({ ALLOWED_EMAIL_DOMAINS: newDomains }, null, 2)
    );
    return newDomains;
  } catch (error) {
    throw new Error("Error updating domain-local.json");
  }
};
