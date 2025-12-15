import { Request, Response } from "express";
import { databases } from "../config/appwrite";
import { ID } from "node-appwrite";
import { CreateProjectDTO } from "../types";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, createdBy } = req.body as CreateProjectDTO;

    if (!title || !description || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const document = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!,
      ID.unique(),
      {
        title,
        description,
        createdBy,
        createdAt: new Date().toISOString()
      }
    );

    return res.status(201).json({
      success: true,
      data: document
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create project"
    });
  }
};


export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const documents = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!
    );

    return res.status(200).json({
      success: true,
      data: documents.documents
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch projects"
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID!,
      id
    );

    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }
};
