import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

interface FormData {
  title: string
  content: string
  id: string
}

const Home: NextPage = () => {
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: ''
  })

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

  async function create (formData : FormData) {
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
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleSubmit = async (formData: FormData) => {
    try {
      create(formData)
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
    </div>
  )
}

export default Home