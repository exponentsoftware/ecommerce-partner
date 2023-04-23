import Navbar from '../components/Navbar'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '@/components/Loading'
import { useRouter } from 'next/router'
import { getToken } from '@/Functions/getToken'
import ErrorComponent from '@/components/ErrorComponent'
import { getRequest } from '@/Functions/Requests'
import { Logout } from '@/Functions/Logout'


export default function Home() {
    const router = useRouter()
    const [getError, setGetError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])

    useEffect(() => {
        if (!getToken()) {
            router.push('/')
        }
        else {
            getProduct()
        }
    }, [])

    const getProduct = async () => {
        try {
            setLoading(true)
            const response = await getRequest('/api/home');
            if (response.message && response.message === 'Unauthorized') {
                router.push(Logout());
            }
            else if (response.message && response.message === 'Error, please try again') {
                setGetError(true);
                setTimeout(() => {
                    setGetError(false)
                }, 6000)
            }
            else {
                console.log(response)
                setProducts(response.sellerProducts)
                setOrders(response.sellerOrders)
                setLoading(false)
            }
        } catch (error) {
            setGetError(true);
            setTimeout(() => {
                setGetError(false)
            }, 6000)
        }
    }


    return (
        <>
            <Head>
                <title>Seller</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-100 flex flex-col'>
                <Navbar />
                {getError && <ErrorComponent />}
                {!loading &&
                    <div className='w-full bg-white gap-4 text-sm pb-10 md:px-4 px-2 grid grid-cols-1 md:grid-cols-4 mt-20'>
                        <div className='w-full shadow-lg p-2 rounded gap-2 flex flex-col'>
                            <span>Sales (this month)</span>
                        </div>
                        <div className='w-full shadow-lg p-2 rounded gap-2 flex flex-col'>
                            <span>Delivered Products</span>
                        </div>
                        <div className='w-full shadow-lg p-2 rounded gap-2 flex flex-col'>
                            <span>Recent Order</span>
                            {orders.length >= 0 && orders.map((e, i) => {
                                return (
                                    <Link key={`recentProduct-${i}`} href={`/product/${e._id}`} className='px-2 text-red-500 text-ellipsis font-thin'>{i + 1}. {e.products[0].product.title}</Link>                            )
                            })}
                        </div>
                        <div className='w-full shadow-lg p-2 rounded gap-2 flex flex-col'>
                            <span>Recent Products</span>
                            {products.length >= 0 && products.map((e, i) => {
                                return (
                                    <Link key={`recentProduct-${i}`} href={`/product/${e._id}`} className='px-2 text-red-500 text-ellipsis font-thin'>{i + 1}. {e.title}</Link>
                                )
                            })}
                            <Link href='/recentProducts' className='ml-auto'>View All</Link>
                        </div>
                    </div>
                }
                {loading && <Loading />}
            </main>
        </>
    )
}