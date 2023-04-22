import Navbar from '../components/Navbar'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/router'
import { getToken } from '@/Functions/getToken'
import ErrorComponent from '@/components/ErrorComponent'
import { FaAngleDown } from 'react-icons/fa'
import { MdAdd, MdClose } from 'react-icons/md'
import { postRequest } from '@/Functions/Requests'
import { Logout } from '@/Functions/Logout'


const categoryList = ['Electronics', 'Footwear', 'Home, Kitchen, Pets', 'Beauty, Health, Grocery', 'Books', "Men's Fashion", "Women's Fashion", "Kid's Fashion"]

export default function Add() {
    const inputRef = useRef(null);
    const router = useRouter()
    const [error, setError] = useState('')
    const [getError, setGetError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showCategory, setShowCategory] = useState(false)
    const [form, setForm] = useState({
        title: '',
        desc: '',
        price: 499,
        brand: '',
        category: '',
        img1: '',
        img2: '',
        img3: '',
        img4: '',
        img1Desc: '',
        img2Desc: '',
        img3Desc: '',
        img4Desc: ''
    })
    const [selectedDiv, setSelectedDiv] = useState('')

    useEffect(() => {
        if (!getToken()) {
            router.push('/')
        }
    }, [])

    const handleForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        let file = e.target.files[0];
        setFileToBase(file);
        e.target.value = ''
    }

    const setFileToBase = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setForm({ ...form, [selectedDiv]: reader.result })
            }
        }
    }

    const handleSubmit = async () => {
        if (!form.title) {
            setError('Please add product title.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (!form.desc) {
            setError('Please add product description.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (!form.price) {
            setError('Please add product price.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (form.price <= 0) {
            setError("Product price can't be less than or equal to 0.")
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (!form.brand) {
            setError('Please add product brand.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (!form.category) {
            setError('Please select product category.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (!form.img1 && !form.img2 && !form.img3 && !form.img4) {
            setError('Please add atleast one image.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (form.img1 && !form.img1Desc) {
            setError('Please add image 1 description.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (form.img2 && !form.img2Desc) {
            setError('Please add image 2 description.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (form.img3 && !form.img3Desc) {
            setError('Please add image 3 description.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else if (form.img4 && !form.img4Desc) {
            setError('Please add image 4 description.')
            setTimeout(() => {
                setError('')
            }, 5000)
        }
        else {
            try {
                setLoading(true)
                const response = await postRequest('/api/addProduct', form);
                setLoading(false)
                if (response.message && response.message === 'Unauthorized') {
                    router.push(Logout());
                }
                if (response.message && response.message.startsWith('Error')) {
                    setGetError(true);
                    setTimeout(() => {
                        setError(false)
                    }, 6000)
                }
                else {
                    setError('Successfully Added.')
                    setTimeout(() => {
                        setError('')
                    }, 5000)
                    setForm({
                        title: '',
                        desc: '',
                        price: 499,
                        brand: '',
                        category: '',
                        img1: '',
                        img2: '',
                        img3: '',
                        img4: '',
                        img1Desc: '',
                        img2Desc: '',
                        img3Desc: '',
                        img4Desc: ''
                    })
                }
            } catch (error) {
                setGetError(true);
                setTimeout(() => {
                    setGetError(false)
                }, 6000)
            }
        }
    }

    const handleClick = (title) => {
        setSelectedDiv(title)
        inputRef.current.click()
    }

    const handleImageDel = (title) => {
        setForm({ ...form, [title]: '' })
    }

    return (
        <>
            <Head>
                <title>Seller - Add Product</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-full flex flex-col'>
                <Navbar />
                {getError && <ErrorComponent />}
                {error && <div className="p-4 fixed right-1 top-1 z-50 w-10/12 md:w-4/12 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    <span className="font-medium">{error}</span>
                </div>}
                <div className='w-full md:w-7/12 mx-auto text-sm p-2 font-light items-center justify-center bg-white gap-4 pb-10 mt-20 flex flex-col'>
                    <span className='font-medium text-base uppercase mx-auto'>Add New Product</span>
                    <input value={form.title} name='title' onChange={handleForm} placeholder='Product Name' className='rounded placeholder:text-slate-400 w-full placeholder:font-light font-light text-sm border-2 border-slate-400 p-2 outline-none' />
                    <textarea onChange={handleForm} value={form.desc} name='desc' rows={8} placeholder='Product Description' className='rounded w-full placeholder:font-light placeholder:text-slate-400 font-light text-sm border-2 border-slate-400 p-2 outline-none' />
                    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='w-full flex items-center gap-2 rounded border-2 border-slate-400 p-2'>
                            <span className='text-sm text-slate-400'>&#x20b9;</span>
                            <input onChange={handleForm} value={form.price} name='price' placeholder='Price' type='number' className=' w-full placeholder:font-normal font-light text-sm  outline-none' />
                        </div>
                        <input onChange={handleForm} value={form.brand} name='brand' placeholder='Brand' type='text' className='flex items-center gap-2 rounded border-2 border-slate-400 p-2 w-full placeholder:font-normal font-light text-sm  outline-none' />
                        <div onClick={() => setShowCategory(!showCategory)} className='w-full flex relative items-center cursor-pointer justify-between rounded text-slate-400 font-light text-sm border-2 border-slate-400 p-2'>
                            <span className={`text-sm ${form.category && 'text-black'}`}>{form.category ? form.category : 'Category'}</span>
                            <FaAngleDown className={`text-xl duration-700 transition-all ${showCategory ? 'rotate-180' : 'rotate-0'} `} />
                            {showCategory && <div className='absolute top-10 md:p-2 p-1 rounded border-2 border-slate-400 bg-white z-20 w-full left-0 right-0 flex flex-col'>
                                {categoryList.map((e, i) => {
                                    return (
                                        <span onClick={() => setForm({ ...form, category: e })} className='text-sm md:p-2 p-1 font-light rounded hover:bg-slate-300 text-black' key={`category-${i}`}>{e}</span>
                                    )
                                })}
                            </div>}
                        </div>
                    </div>
                    <span className='w-full'>Upload Images</span>
                    <div className='w-full grid grid-cols-2 gap-4'>
                        <input name='img' ref={inputRef} type='file' className='hidden' accept='image/*' onChange={handleImageChange} />
                        {form.img1 ?
                            <div className='w-full flex  relative min-h-36 md:min-h-48'>
                                <img onClick={() => handleClick('img1')} src={form.img1} alt='' className={`w-full cursor-pointer`} />
                                <MdClose onClick={() => handleImageDel('img1')} className='absolute text-xl top-0 right-0 cursor-pointer hover:text-2xl' />
                            </div>
                            : <div onClick={() => handleClick('img1')} className={`w-full min-h-[8rem] cursor-pointer flex justify-center items-center bg-slate-100 rounded`}>
                                <MdAdd className="text-xl" />
                            </div>}
                        {form.img2 ?
                            <div className='w-full flex relative'>
                                <img onClick={() => handleClick('img2')} src={form.img2} alt='' className={`w-full cursor-pointer`} />
                                <MdClose onClick={() => handleImageDel('img2')} className='absolute text-xl top-0 right-0 cursor-pointer hover:text-2xl' />
                            </div>
                            : <div onClick={() => handleClick('img2')} className={`w-full cursor-pointer min-h-[8rem]  flex justify-center items-center bg-slate-100 rounded`}>
                                <MdAdd className="text-xl" />
                            </div>}
                        {form.img3 ?
                            <div className='w-full flex relative'>
                                <img onClick={() => handleClick('img3')} src={form.img3} alt='' className={`w-full cursor-pointer`} />
                                <MdClose onClick={() => handleImageDel('img3')} className='absolute text-xl top-0 right-0 cursor-pointer hover:text-2xl' />
                            </div>
                            : <div onClick={() => handleClick('img3')} className={`w-full cursor-pointer min-h-[8rem]  flex justify-center items-center bg-slate-100 rounded`}>
                                <MdAdd className="text-xl" />
                            </div>}
                        {form.img4 ?
                            <div className={`w-full flex relative`}>
                                <img onClick={() => handleClick('img4')} src={form.img4} alt='' className={`cursor-pointer`} />
                                <MdClose onClick={() => handleImageDel('img4')} className='absolute text-xl top-0 right-0 cursor-pointer hover:text-2xl' />
                            </div>
                            : <div onClick={() => handleClick('img4')} className={`w-full min-h-[8rem] cursor-pointer flex justify-center items-center bg-slate-100 rounded`}>
                                <MdAdd className="text-xl" />
                            </div>}
                    </div>
                    <div className='w-full grid gap-4 grid-cols-1 md:grid-cols-2'>
                        {form.img1 && <textarea onChange={handleForm} value={form.img1Desc} name='img1Desc' rows={6} placeholder='Image 1 Description' className='rounded w-full placeholder:font-light placeholder:text-slate-400 font-light text-sm border-2 border-slate-400 p-2 outline-none' />}
                        {form.img2 && <textarea onChange={handleForm} value={form.img2Desc} name='img2Desc' rows={6} placeholder='Image 2 Description' className='rounded w-full placeholder:font-light placeholder:text-slate-400 font-light text-sm border-2 border-slate-400 p-2 outline-none' />}
                        {form.img3 && <textarea onChange={handleForm} value={form.img3Desc} name='img3Desc' rows={6} placeholder='Image 3 Description' className='rounded w-full placeholder:font-light placeholder:text-slate-400 font-light text-sm border-2 border-slate-400 p-2 outline-none' />}
                        {form.img4 && <textarea onChange={handleForm} value={form.img4Desc} name='img4Desc' rows={6} placeholder='Image 4 Description' className='rounded w-full placeholder:font-light placeholder:text-slate-400 font-light text-sm border-2 border-slate-400 p-2 outline-none' />}
                    </div>
                    <div className='w-full flex justify-end'>
                        <button onClick={handleSubmit} className='bg-red-500 w-full md:w-1/4 p-3 text-white text-sm font-light rounded float-right hover:bg-red-600'>ADD NOW</button>
                    </div>
                </div>
                {loading && <Loading />}
            </main>
        </>
    )
}