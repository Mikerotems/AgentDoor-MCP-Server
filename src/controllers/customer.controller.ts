import { Request, Response } from "express";
import { customerModel } from "../models/customerModel";

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body ?? {};

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "name and email are required",
      });
      return;
    }

    const existingCustomer = await customerModel.findOne({ email });

    if (existingCustomer) {
      res.status(409).json({
        success: false,
        message: "Customer already exists",
      });
      return;
    }

    const customer = await customerModel.create({
      name,
      email,
    });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error,
    });
  }
};

export const getCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await customerModel.findById(req.params.id);

    if (!customer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error,
    });
  }
};

export const listCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customers = await customerModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error,
    });
  }
};