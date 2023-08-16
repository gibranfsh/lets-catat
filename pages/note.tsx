import type { GetServerSideProps } from 'next'
import { prisma } from '../lib/prisma'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getSession } from 'next-auth/react'

interface Note {
    id: string
    userId: string
    title: string
    content: string
}

interface FormData {
    id: string
    userId: string
    title: string
    content: string
}

interface User {
    id: string
    name: string
    email: string
    image?: string
    emailVerified?: string
    role: string
}

const Note = ({ user, notes }: { user: User, notes: Note[] }) => {
    const [form, setForm] = useState<FormData>({
        userId: user?.id,
        title: '',
        content: '',
        id: ''
    })
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter()
    const refreshData = () => {
        router.replace(router.asPath)
    }

    async function createNote(formData: FormData) {
        try {
            const res = await fetch('http://localhost:3000/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            await res.json()
            setForm({ id: '', userId: user?.id, title: '', content: '' })
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteNote(id: string) {
        try {
            const res = await fetch(`http://localhost:3000/api/note/${id}`, {
                method: 'DELETE'
            })

            await res.json()
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    async function updateNote(id: string) {
        try {
            const res = await fetch(`http://localhost:3000/api/note/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })

            await res.json()
            setForm({ id: '', userId: user?.id, title: '', content: '' })
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        try {
            createNote(formData)
        } catch (error) {
            console.log(error)
        }
    }

    const openPopup = (note: FormData) => {
        setForm(note);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <h1 className="text-center font-bold text-2xl mt-4">LetsCatat for KAMI Foundation</h1>
            <form onSubmit={e => {
                e.preventDefault()
                handleSubmit(form)
            }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
                <input type="text"
                    placeholder='Title'
                    value={form.title}
                    required
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className='border-2 rounded border-gray-600 p-1'
                />
                <textarea
                    placeholder='Content'
                    value={form.content}
                    required
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className='border-2 rounded border-gray-600 p-1'
                />
                <button
                    className="bg-gray-500 text-white rounded p-1 mt-4 transition duration-300 ease-in-out hover:bg-gray-600 hover:shadow-lg"
                    onClick={() => router.push("/")}
                >
                    Back to Homepage
                </button>

                <button type='submit' className='bg-blue-500 text-white rounded p-1 transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg'>Add +</button>
            </form>
            <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
                {notes.length > 0 ? (
                    <ul>
                        {notes.map(note => (
                            <li key={note.id} className='border-b border-gray-600 p-2'>
                                <div className="flex justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold">{note.title}</h3>
                                        <p className="text-sm">{note.content}</p>
                                    </div>
                                    <button className="bg-green-500 px-3 text-white rounded mr-2 transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg" onClick={() => openPopup(note)}>Update</button>
                                    <button className="bg-red-500 px-3 text-white rounded transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg" onClick={() => deleteNote(note.id)}>X</button>
                                </div>
                            </li>
                        ))}
                    </ul>) : (
                    <p className="text-center">No notes yet.</p>
                )}
            </div>
            {showPopup && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Update Note</h2>
                        <form onSubmit={e => {
                            e.preventDefault();
                            updateNote(form.id);
                            closePopup();
                        }} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold">Title</label>
                                <input type="text"
                                    placeholder='Title'
                                    required
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className='border-2 rounded border-gray-600 p-1'
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 font-bold">Content</label>
                                <textarea
                                    placeholder='Content'
                                    value={form.content}
                                    required
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    className='border-2 rounded border-gray-600 p-1'
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-500 px-3 text-white rounded transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg">Update</button>
                                <button onClick={closePopup} className="bg-red-500 px-3 text-white rounded ml-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Note

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const user = session.user as User;

    // find notes by user id
    const notes = await prisma.note.findMany({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            userId: true,
            title: true,
            content: true
        }
    })

    return {
        props: {
            user,
            notes
        }
    }
}