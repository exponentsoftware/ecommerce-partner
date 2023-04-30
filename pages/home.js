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
import Graph from '@/components/Graph'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import { BiRupee } from 'react-icons/bi'
import moment from 'moment'
const CryptoJS = require('crypto-js')
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)


export default function Home() {
    const router = useRouter()
    const [getError, setGetError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [delivered, setDelivered] = useState([])
    const [ordersNumber, setOrdersNumber] = useState(0)
    const [deliveredNumber, setdeliveredNumber] = useState(0)
    const [newProductsNumber, setnewProductsNumber] = useState(0)

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
                setProducts(response.sellerProducts)
                setnewProductsNumber(response.productLength.length)
                setOrdersNumber(response.orderLength.length)
                setdeliveredNumber(response.monthlyDelivered.length)
                setDelivered(response.deliveredOrders)
                setLoading(false)
                const dataUpdate = await response.sellerOrders.map((e) => {
                    let bytesFullName = CryptoJS.AES.decrypt(e.fullName, process.env.JWT);
                    let decryptFullName = bytesFullName.toString(CryptoJS.enc.Utf8);
                    let bytesAdress = CryptoJS.AES.decrypt(e.DeliveryAddress, process.env.JWT);
                    let decryptAddress = bytesAdress.toString(CryptoJS.enc.Utf8)
                    let stillUtc = moment.utc(e.paymentDate).toDate();
                    let responseTime = moment(stillUtc).local().format('lll')
                    return { ...e, fullName: decryptFullName, DeliveryAddress: decryptAddress, paymentDate: responseTime }
                })
                setOrders(dataUpdate)
                console.log(dataUpdate)
            }
        } catch (error) {
            console.log(error)
            setGetError(true);
            setTimeout(() => {
                setGetError(false)
            }, 6000)
        }
    }


    return (
        <>
            <Head>
                <title>Home - Seller</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
            </Head>

            <main className='w-100 flex flex-col'>
                <Navbar />
                {getError && <ErrorComponent />}
                {!loading &&
                    <div className='flex w-full flex-col gap-2 overflow-hidden'>
                        <div className='w-full bg-white gap-4 text-sm pb-10 md:px-4 px-2 grid grid-cols-1 md:grid-cols-3 mt-20'>
                            <div className='w-full p-2 rounded gap-2 flex flex-col justify-center items-center'>
                                <span className='w-full text-left font-medium'>Statistics (this month)</span>
                                <Graph orders={ordersNumber} delivered={deliveredNumber} newProducts={newProductsNumber} />
                            </div>
                            <div className='w-full p-2 h-auto rounded gap-2 flex flex-col'>
                                <div className='w-full flex text-sm justify-between items-center'>
                                    <span className='font-medium'>Recent Delivered</span>
                                    <Link href='/recentDelivered' className='ml-auto font-medium'>View All</Link>
                                </div>
                                {delivered.length >= 0 && delivered.map((e, i) => {
                                    return (
                                        <Link key={`recentDelivered-${i}`} href={`/product/${e._id}`} className='px-2 text-red-500 text-ellipsis font-medium'>{i + 1}. {e.products[0].product.title}</Link>)
                                })}
                            </div>
                            <div className='w-full p-2 rounded gap-2 flex flex-col'>
                                <div className='w-full flex text-sm justify-between items-center'>
                                    <span className='font-medium'>Recent Products</span>
                                    <Link href='/recentProducts' className='ml-auto font-medium'>View All</Link>
                                </div>
                                {products.length >= 0 && products.map((e, i) => {
                                    return (
                                        <Link key={`recentProduct-${i}`} href={`/product/${e._id}`} className='px-2 text-red-500 text-ellipsis font-medium'>{i + 1}. {e.title}</Link>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='p-2 text-sm w-full overflow-hidden rounded flex flex-col'>
                            <div className='w-full mb-4 flex text-sm uppercase justify-between items-center'>
                                <span className='font-medium'>Orders yet to deliver</span>
                                <div className='flex gap-2'>
                                    <button className='rounded bg-red-500 p-2 text-white tfont-medium'>Mark As Packed</button>
                                </div>
                            </div>

                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="p-4">
                                            </th>
                                            <th scope="col" className="p-4 font-medium">
                                                Order ID
                                            </th>
                                            <th scope="col" className="p-4 font-medium">
                                                Product
                                            </th>
                                            <th scope="col" className="p-4 font-medium">
                                                Customer Name
                                            </th>
                                            <th scope="col" className="p-4 w-[15rem] font-medium">
                                                Delivery Address
                                            </th>
                                            <th scope="col" className="p-4 font-medium">
                                                Amount Paid
                                            </th>
                                            <th scope="col" className="p-4 font-medium">
                                                Payment Date & Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length >= 0 && orders.map((e, i) => {
                                            return (
                                                <tr key={`data${i}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <td className="w-4 p-4">
                                                        <div className="flex items-center">
                                                            <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        </div>
                                                    </td>
                                                    <th scope="row" className="p-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <Link href={`/order/${e._id}`} className='text-red-500 font-medium'>
                                                            {e.orderId}
                                                            {/* <ResponsiveEllipsis text={e.orderId}
                                                                maxLine='1'
                                                                ellipsis='...'
                                                                trimRight
                                                                basedOn='letters' /> */}
                                                        </Link>
                                                    </th>
                                                    <td className="p-4 font-medium">
                                                        <ResponsiveEllipsis key={`productId${i}`} text={e.products[0].product.title}
                                                            maxLine='1'
                                                            ellipsis=''
                                                            trimRight
                                                            basedOn='letters' />
                                                    </td>
                                                    <td className="p-4 font-medium">
                                                        <ResponsiveEllipsis text={e.fullName}
                                                            maxLine='1'
                                                            ellipsis=''
                                                            trimRight
                                                            basedOn='letters' />
                                                    </td>
                                                    <td className="p-4 w-[15rem] font-medium">
                                                        <ResponsiveEllipsis text={e.DeliveryAddress}
                                                                    maxLine='1'
                                                                    ellipsis=''
                                                                    trimRight
                                                                    basedOn='letters' />
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap">
                                                        <span className='flex items-center font-medium'>
                                                            <BiRupee className='text-sm' />
                                                            <span>
                                                                <ResponsiveEllipsis text={e.grandTotal}
                                                                    maxLine='1'
                                                                    ellipsis='...'
                                                                    trimRight
                                                                    basedOn='letters' />
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap font-medium">
                                                        {e.paymentDate}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                {loading && <Loading />}
            </main>
        </>
    )
}