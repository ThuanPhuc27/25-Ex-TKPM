import { Request, Response } from "express";
import { getDomains, updateDomains } from "../repositories/domainRepository";

export const getDomainList = (req: Request, res: Response): void => {
  try {
    const domains = getDomains();
    res.status(200).json({ ALLOWED_EMAIL_DOMAINS: domains });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateDomainList = (req: Request, res: Response): void => {
  try {
    const { ALLOWED_EMAIL_DOMAINS } = req.body;

    if (!Array.isArray(ALLOWED_EMAIL_DOMAINS)) {
      res.status(400).json({ error: "Invalid input format" });
      return;
    }

    const updatedDomains = updateDomains(ALLOWED_EMAIL_DOMAINS);
    res.status(200).json({
      message: "Updated successfully",
      ALLOWED_EMAIL_DOMAINS: updatedDomains,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
