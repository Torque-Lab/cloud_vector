import type { Request, Response } from "express";

import { prismaClient, PrismaClient } from "@cloud/db";
export const getAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const account = await prismaClient.userBaseAdmin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found", success: false });
    }

    return res
      .status(200)
      .json({
        firstName: account?.first_name || "",
        lastName: account?.last_name || "",
        email: account?.email || "",
        company: account?.company || "",
        jobTitle: account?.job_title || "",
        message: "Account found",
        success: true,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
