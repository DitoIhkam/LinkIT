import { writeTransactionLog } from "../utils/transactionLogger";
import { prisma } from "../lib/prisma";
import {
    createTransactionSchema,
    updateTransactionSchema
} from "../validation/transaction.validation";

export async function createTransaction(req: any, res: any, next: any) {
    try {

        const validation = createTransactionSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: validation.error.flatten()
            });
        }

        const { coffeeId, qty, notes } = validation.data;

        const transaction = await prisma.transaction.create({
            data: {
                coffeeId,
                qty,
                notes
            }
        });

        res.status(201).json(transaction);
        writeTransactionLog(
            `CREATE Transaction ID=${transaction.id} Coffee=${transaction.coffeeId} Qty=${transaction.qty}`
);

    } catch (error) {
        next(error);
    }
}

export async function getTransactions(req: any, res: any, next: any) {
    try {

        const transactions = await prisma.transaction.findMany({
            include: {
                coffee: true
            },
            orderBy: {
                id: "desc"
            }
        });

        res.json(transactions);

    } catch (error) {
        next(error);
    }
}

export async function updateTransaction(req: any, res: any, next: any) {
    try {

        const validation = updateTransactionSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: validation.error.flatten()
            });
        }

        const id = Number(req.params.id);

        const transaction = await prisma.transaction.update({
            where: {
                id
            },
            data: validation.data
        });

        res.json(transaction);
        writeTransactionLog(
            `UPDATE Transaction ID=${transaction.id}`
);

    } catch (error) {
        next(error);
    }
}

export async function deleteTransaction(req: any, res: any, next: any) {
    try {

        const id = Number(req.params.id);

        await prisma.transaction.delete({
            where: {
                id
            }
        });


        writeTransactionLog(
            `DELETE Transaction ID=${id}`
);
        res.json({
            message: "Transaction deleted"
        });

    } catch (error) {
        next(error);
    }
}
