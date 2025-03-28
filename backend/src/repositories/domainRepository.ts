import fs from "fs";
import path from "path";

const domainPath = path.join(__dirname, "../data/domain.json");
export const getDomains = (): string[] => {
    try {
      const data = fs.readFileSync(domainPath, "utf-8");
      const { ALLOWED_EMAIL_DOMAINS } = JSON.parse(data);
      return Array.isArray(ALLOWED_EMAIL_DOMAINS) ? ALLOWED_EMAIL_DOMAINS : [];
    } catch (error) {
      throw new Error("Error reading domain.json");
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
      throw new Error("Error updating domain.json");
    }
  };
  