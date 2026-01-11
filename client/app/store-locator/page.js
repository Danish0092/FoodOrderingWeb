"use client";
import React from "react";

export default function StoreLocator() {
  return (
    <div className="min-h-screen mt-10 md:mt-0 bg-gray flex flex-col items-center justify-center py-10 px-4">
      {/* MAIN GRID SECTION */}
      <div className="w-full bg-neutral p-4 rounded-2xl max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-8">


        {/* MAP SECTION */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <iframe
            title="Store Location"
            src="https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d150.75356794059923!2d74.20902194121186!3d31.407042812655753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e6!4m3!3m2!1d31.4078801!2d74.2090034!4m3!3m2!1d31.4070142!2d74.2091895!5e1!3m2!1sen!2s!4v1760984222729!5m2!1sen!2s"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-none w-full h-[400px] md:h-[400px]"
          ></iframe>
        </div>

        {/* STORE DETAILS */}
        <div className="shadow-md rounded-2xl p-6 flex flex-col gap-4 justify-center text-center md:text-left">
          <h2 className="text-2xl font-semibold text-yellow text-center mb-2">
            Our Main Branch
          </h2>
          <p className="mb-3">
            <i className="ri-map-pin-2-line text-yellow-500 text-xl align-middle"></i>{" "}
            Haddi Fast Foods, LDA J block, Lahore
          </p>
          <p className="mb-1">
            <i className="ri-phone-line text-yellow-500 text-xl align-middle"></i>{" "}
            +92 325 9726009
          </p>
          <p className="mb-4">
            <i className="ri-time-line text-yellow-500 text-xl align-middle"></i>{" "}
            Open: 9:00 AM - 2:00 AM
          </p>

          <button
            onClick={() =>
              window.open("https://maps.app.goo.gl/rXNTtFLTgv2CjC148", "_blank")
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer"
          >
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}
