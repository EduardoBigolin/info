import { Request, Response } from "express";
import bcrypt from "bcrypt";

interface userDTO {
    name: string,
    email: string,
    password: string,
    dataNasc: string,
    isAdmin: boolean
    photoFile?: string
}
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function save(userData: userDTO) {
    await prisma.user.create(
        {
            data: {
                name: userData.name,
                email: userData.email,
                isAdmin: false,
                dataNasc: userData.dataNasc,
                password: userData.password,
                photoFile: userData.photoFile as string,
            },
        }
    )
}
async function verifyIfEmailAtUse(email: string) {
    const emailExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (emailExist) {
        throw new Error("This email at used")
    }
}
function validation(userData: userDTO) {
    if (!userData.name) {
        throw new Error("INVALID NAME")
    }
    if (!userData.email) {
        throw new Error("INVALID EMAIL")
    }
    if (!userData.dataNasc) {
        throw new Error("INVALID BIRTH DATE")
    }
    if (!userData.password) {
        throw new Error("INVALID PASSWORD")
    }
}

export class CreateUserController {

    public static async execute(req: Request, res: Response) {
        try {
            const { name, email, password, dataNasc, isAdmin } = req.body;
            validation({ name, email, password, dataNasc, isAdmin });

            await verifyIfEmailAtUse(email);

            const fileName = `${req.file?.destination}/${req.file?.filename}`;
            const passwordHash = await bcrypt.hash(password, 12);

            await save({
                name,
                email,
                password: passwordHash,
                dataNasc,
                isAdmin,
                photoFile: fileName
            })
            return res.status(400).json({
                message: "Foi"
            })
        } catch (error: any) {
            return res.status(400).json({
                message: error.message
            })
        }
    }


}