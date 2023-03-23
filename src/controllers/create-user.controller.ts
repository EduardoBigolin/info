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

export class CreateUserController {

    public static async execute(req: Request, res: Response) {
        const { name, email, password, dataNasc, isAdmin } = req.body;
        try {
            // this.validation({ name, email, password, dataNasc, isAdmin });
            const fileName = req.file?.filename;
            console.log(fileName);

            const passwordHash = await bcrypt.hash(password, 12);
            await save({
                name,
                email,
                password: passwordHash,
                dataNasc,
                isAdmin,
                photoFile: fileName
            })
        } catch (error: any) {
            return res.status(400).json({
                message: error.message
            })
        }
    }

    // public static validation(userData: userDTO) {
    //     if (!userData.name) {
    //         throw new Error("INVALID NAME")
    //     }
    //     if (!userData.email) {
    //         throw new Error("INVALID EMAIL")
    //     }
    //     if (!userData.dataNasc) {
    //         throw new Error("INVALID BIRTH DATE")
    //     }
    //     if (!userData.password) {
    //         throw new Error("INVALID PASSWORD")
    //     }
    // }
}