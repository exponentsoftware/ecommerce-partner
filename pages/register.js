import Navbar from '../components/Navbar'
import Head from 'next/head'
import Input from '@/components/Input'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Label from '@/components/Label'
import Loading from '@/components/Loading'
import { useRouter } from 'next/router'
import { getToken } from '@/Functions/getToken'
import ErrorComponent from '@/components/ErrorComponent'


export default function Register() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        email: '',
        password: '',
        type: 'Seller'
    })
    const [getError, setGetError] = useState(false)

    useEffect(() => {
        if (getToken()) {
            router.push('/');
        }
    }, [])

    const handleForm = (e) => {
        e.preventDefault()
        if (data.email && data.password && data.type) {
            if (data.password.length >= 6) {
                setLoading(true)
                fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then((res) => {
                        if (res.message && res.message.startsWith('Error')) {
                            setGetError(true)
                            setLoading(false)
                            setTimeout(() => {
                                setGetError(false)
                            }, 6000)
                        }
                        else {
                            setError(res.message)
                            setLoading(false)
                        }
                    })
                    .catch(() => {
                        setGetError(true)
                        setLoading(false)
                        setTimeout(() => {
                            setGetError(false)
                        }, 6000)
                    })
            }
            else {
                setError('Password must be at least 6 characters.')
            }
        }
        else {
            setError('Please fill all details...')
        }
    }

    useEffect(() => {
        setError('')
    }, [data])


    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-100 flex flex-col'>
                <Navbar />
                {getError && <ErrorComponent />}
                <div className='w-full gap-4 pb-10 mt-20 flex flex-col'>
                    <form onSubmit={handleForm} className='w-full flex py-4 px-4 md:px-20 flex-col gap-8 md:w-1/2 mx-auto shadow-xl'>
                        <span className='text-center font-semibold text-xl'>Register</span>
                        <Input type='email' data={data} setData={setData} placeholder='Email Address' name='email' value={data.email} />
                        <Input type='password' data={data} setData={setData} placeholder='Password' name='password' value={data.password} />
                        {/* <div className='grid grid-cols-2 sm:grid-cols-3 w-full items-center gap-5'>
                            <Label data={data} setData={setData} text='Customer' />
                            <Label data={data} setData={setData} text='Seller' />
                            <Label data={data} setData={setData} text='Partner' />
                        </div> */}
                        <div className='w-full text-sm font-medium flex gap-10'>
                            <button type='submit' disabled={error ? true : false} className='rounded-full w-full border-[0.14rem] text-medium hover:bg-white hover:text-red-500 bg-red-500 text-white border-red-500 p-2'>Register</button>
                            <Link className='rounded-full w-full border-[0.14rem] text-medium hover:bg-red-500 hover:text-white text-center bg-white text-red-500 border-red-500 p-2' href='/'>Login</Link>
                        </div>
                        {error && <div className='w-full p-3 text-sm font-medium rounded text-white bg-red-500'>
                            {error}
                        </div>}
                    </form>
                </div>
                {loading && <Loading />}
            </main>
        </>
    )
}