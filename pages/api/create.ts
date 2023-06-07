import { prisma } from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { title, content } = req.body;

    try {
        await prisma.note.create({
            data: {
                title,
                content,
            },
        });

        res.status(201).json({ message: 'Note created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }

}