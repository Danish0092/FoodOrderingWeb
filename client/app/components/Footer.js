import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (



        <footer className="text-white bg-gray p-6">
            <div className="grid grid-col-1 sm:grid-cols-3 gap-4">


                <div className="flex flex-col items-center justify-center">
                    <h2 className="font-baloo text-yellow font-black text-4xl">Haddi
                        <span className="text-white"> Fast Foods</span>
                    </h2>

                    <Link
                        href="https://youtube.com/@haadifoodpizza"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-black hover:text-white 
                        bg-white hover:bg-red rounded-full w-8 h-8 cursor-pointer">
                        <i className="ri-youtube-fill"></i>
                    </Link>


                </div>

                <div className="flex flex-col items-center justify-center">
                    <span className="font-bold text-xl">Quick Links</span>
                    <Link href="/" className="text-lg hover:underline hover:text-yellow">Home</Link>
                    <Link href="/store-locator" className="text-lg hover:underline hover:text-yellow">Store Locator</Link>
                </div>

                <div className="flex flex-col items-center justify-center text-xl">
                    <span className="font-bold text-xl">Contact Info</span>
                    <div className="flex gap-2">
                        <i className="ri-map-pin-2-line text-xl"></i>
                        <span className="font-baloo hover:text-yellow text-lg text-center w-40">Block J Lda Avenue</span>
                    </div>



                    <div className="flex gap-2 items-center justify-center">
                        <i className="ri-phone-line text-xl"></i>
                        <span className="font-baloo hover:text-yellow text-lg">03259726009</span>
                    </div>

                </div>

            </div>


            <div className="bg-neutral h-0.5 my-3 w-full"></div>

            <div className="m-auto text-center">© 2025 Haddi Fast Foods ~ By Team. All rights reserved.</div>
        </footer >
    )
}

export default Footer
