import axios from "axios";
import { prisma } from "../lib/prisma";

export async function importCoffee(req: any, res: any) {
    try {

        const response = await axios.get(
            "https://api.sampleapis.com/coffee/hot"
        );

        const coffees = response.data;

        let total = 0;

        for (const coffee of coffees) {

            await prisma.coffee.upsert({
                where: {
                    apiId: coffee.id
                },
                update: {
                    title: coffee.title,
                    description: coffee.description,
                    image: coffee.image
                },
                create: {
                    apiId: coffee.id,
                    title: coffee.title,
                    description: coffee.description,
                    image: coffee.image
                }
            });

            total++;

        }

        res.json({
            message: "Import Success",
            total
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Import Failed"
        });

    }
}

export async function getCoffees(req: any, res: any) {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = String(req.query.search || "");

    const sort = String(req.query.sort || "id");
    const order = req.query.order === "desc" ? "desc" : "asc";

    const skip = (page - 1) * limit;

    const total = await prisma.coffee.count({
    where: {
        title: {
            contains: search,
            mode: "insensitive"
        }
    }
});

    const coffees = await prisma.coffee.findMany({
    where: {
        title: {
            contains: search,
            mode: "insensitive"
        }
    },
    skip,
    take: limit,
    orderBy: {
        [sort]: order
    }
});



 
    res.json({
    page,
    limit,
    search,
    sort,
    order,
    total,
    totalPages: Math.ceil(total / limit),
    data: coffees
});




}
