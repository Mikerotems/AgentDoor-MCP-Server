import { Request, Response } from "express";
import { customerModel } from "../models/customerModel";

export async function createCustomer(
  req: Request,
  res: Response
) {
  try {
    const {
      cust_name,
      cust_email,
      cust_phone,
    } = req.body;

    const customer =
      await customerModel.create({
        cust_name,
        cust_email,
        cust_phone,
      });

    return res.status(201).json(
      customer
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create customer",
    });
  }
}