import type { GetServerSideProps, NextPage } from 'next'
import { prisma } from '../lib/prisma'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface Notes {
  notes: {
    id: string
    title: string
    content: string
  }[];
}

interface FormData {
  title: string
  content: string
  id: string
}

const Home = ({ notes }: Notes) => {
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: ''
  })
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  // const create = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3000/api/create', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(form)
  //     })

  //     const data = await res.json()
  //     setForm({ title: '', content: '', id: '' })
  //     console.log(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async function createNote(formData: FormData) {
    try {
      const res = await fetch('http://localhost:3000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      setForm({ title: '', content: '', id: '' })
      refreshData()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteNote(id: string) {
    try {
      const res = await fetch(`http://localhost:3000/api/note/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      refreshData()
      console.log(data)
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


  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">LetsCatat</h1>
      <form onSubmit={e => {
        e.preventDefault()
        handleSubmit(form)
      }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
        <input type="text"
          placeholder='Title'
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className='border-2 rounded border-gray-600 p-1'
        />
        <textarea
          placeholder='Content'
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className='border-2 rounded border-gray-600 p-1'
        />

        <button type='submit' className='bg-blue-500 text-whiite rounded p-1'>Add +</button>
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
                  <button className="bg-red-500 px-3 text-white rounded" onClick={() => deleteNote(note.id)}>X</button>
                </div>
              </li>
            ))}
          </ul>) : (
          <p className="text-center">No notes yet.</p>
        )}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: { // select only the fields you need
      id: true,
      title: true,
      content: true
    }
  })
  return {
    props: {
      notes
    }
  }
}