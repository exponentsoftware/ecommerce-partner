import Link from "next/link";
import { useRouter } from "next/router";
import { BiHomeAlt2, BiUser } from 'react-icons/bi'

export default function Navbar() {
    const router = useRouter()
    return (
        <div className={`flex flex-row fixed z-20 gap-2 sm:gap-5 w-full items-center bg-red-500 justify-center p-3 box-border`}>
            <Link href='/' className={`text-white sm:block font-medium mr-auto text-base`}><span className="font-semibold text-lg">EASY</span> ORDER</Link>

            <button className='p-2 sm:py-1 sm:px-3 flex flex-row justify-center items-center gap-1 rounded-full border-[0.14rem] border-white hover:bg-red-500  hover:text-white uppercase font-semibold bg-white'>
                {router.pathname.includes('login') || router.pathname.includes('register') || router.pathname.includes('/account') ?
                    <>
                        <BiHomeAlt2 className="text-xl" />
                        <span className="text-sm hidden sm:block">Home</span>
                    </>
                    :
                    <>
                        <BiUser className="text-xl" />
                        <span className="text-sm hidden sm:block">Account</span>
                    </>}
            </button>
        </div>
    )
}