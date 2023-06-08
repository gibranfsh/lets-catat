import { prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const noteId = req.query.id as string;

    if (req.method === 'GET') {
        try {
            const note = await prisma.note.findUnique({
                where: {
                    id: noteId,
                },
            });

            res.status(200).json(note);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    } else if (req.method === 'PUT') {
        const { title, content } = req.body;

        try {
            await prisma.note.update({
                where: {
                    id: noteId,
                },
                data: {
                    title,
                    content,
                },
            });

            res.status(200).json({ message: 'Note updated successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.note.delete({
                where: {
                    id: noteId,
                },
            });

            res.status(200).json({ message: 'Note deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}