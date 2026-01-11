"use client";
import React from "react";
import Link from "next/link";

export default function WhatsAppButton() {
    const phoneNumber = "923259726009";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-20 bottom-5 right-5 flex items-center justify-center 
            w-11 h-11 bg-green rounded-full ">

            <i className="ri-whatsapp-line text-3xl"></i>
        </Link>
    );
}
