import { useRouter } from "next/router";
import { getToken } from "/Functions/getToken";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiRupee, BiUser } from 'react-icons/bi'
import { MdAdd, MdClose, MdMenu } from 'react-icons/md'

export default function Navbar() {
    const router = useRouter();
    const [token, setToken] = useState('')
    const [menu, setMenu] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (menu) {
            setTimeout(() => {
                setVisible(true)
            }, 500)
        }
        else {
            setVisible(false)
        }
    }, [menu])

    useEffect(() => {
        setToken(getToken())
    }, [])
    return (
        <div className={`flex flex-row fixed z-20 gap-2 sm:gap-5 w-full items-center bg-red-500 justify-center p-3 box-border`}>
            <Link href='/home' className={`text-white sm:block font-medium mr-auto text-base`}><span className="font-semibold text-lg">EASY</span> ORDER</Link>
            {token && <div onClick={() => setMenu(!menu)} className='p-2 cursor-pointer sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <MdMenu className="text-xl" />
            </div>}
            {token && <Link href={`/add`} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <MdAdd className="text-xl" />
                <span className="text-sm hidden sm:block">New Product</span>
            </Link>}
            {token && <Link href={`/earning`} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <BiRupee className="text-xl" />
                <span className="text-sm hidden sm:block">Earning</span>
            </Link>}
            <Link href={token ? `/account` : '/'} className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-medium bg-white'>
                <BiUser className="text-xl" />
                <span className="text-sm hidden sm:block">Account</span>
            </Link>
            <div className={`fixed transition-all flex flex-col font-medium duration-1000 ${menu ? 'w-10/12 md:w-3/12' : 'w-0'} top-0 h-full bottom-0 left-0 bg-white shadow-2xl`}>
                {visible && <>
                    <div className="w-full p-3 flex justify-between items-center">
                        <span className={`sm:block font-medium text-red-500 mr-auto text-base`}><span className="font-semibold text-lg">EASY</span> ORDER</span>
                        <div onClick={() => setMenu(false)} className="shadow-lg rounded-full w-9 h-9 flex justify-center items-center cursor-pointer p-2">
                            <MdClose className="" />
                        </div>
                    </div>
                    <Link href={'/notpacked'} className="p-4 mt-4 text-xs uppercase cursor-pointer hover:bg-red-50">Orders not packed</Link>
                    <Link href={'/notdelivered'} className="p-4 text-xs uppercase cursor-pointer hover:bg-red-50">Orders not delivered</Link>
                </>}
            </div>
        </div>
    )
}