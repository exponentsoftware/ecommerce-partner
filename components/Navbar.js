import { useRouter } from "next/router";
import { getToken } from "/Functions/getToken";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiRupee, BiUser } from 'react-icons/bi'
import { MdAdd } from 'react-icons/md'

export default function Navbar() {
    const router = useRouter();
    const [token, setToken] = useState('')
    useEffect(() => {
        setToken(getToken())
    }, [])
    return (
        <div className={`flex flex-row fixed z-20 gap-2 sm:gap-5 w-full items-center bg-red-500 justify-center p-3 box-border`}>
            <Link href='/home' className={`text-white sm:block font-medium mr-auto text-base`}><span className="font-semibold text-lg">EASY</span> ORDER</Link>
            {token && <Link href={`/add`} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <MdAdd className="text-xl" />
                <span className="text-sm hidden sm:block">New Product</span>
            </Link>}
            {token && <Link href={`/earning`} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <BiRupee className="text-xl" />
                <span className="text-sm hidden sm:block">Earning</span>
            </Link>}
            <Link href={token ? `/account` : '/' } className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <BiUser className="text-xl" />
                <span className="text-sm hidden sm:block">Account</span>
            </Link>
        </div>
    )
}