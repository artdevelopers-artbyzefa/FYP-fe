import React from "react";
import "./footer.css";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#d6dde6] font-sans min-h-[120px] flex items-center px-6">

            <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10 py-10">

                {/* Brand FIXED LEFT */}
                <div className="w-full md:w-auto md:pl-3 flex justify-start">
                    <span className="text-[14px] font-black text-[#abb8c9] font-['Arial_Black',Arial,sans-serif]">
                        CUI FYP System
                    </span>
                </div>

                {/* Links */}
                <div className="flex gap-10">
                    <a href="#" className="footer-link text-[14px] text-[#7f90a6] font-semibold">
                        About
                    </a>
                    <a href="#" className="footer-link text-[14px] text-[#7f90a6] font-semibold">
                        Guidelines
                    </a>
                    <a href="#" className="footer-link text-[14px] text-[#7f90a6] font-semibold">
                        Contact
                    </a>
                </div>

                {/* Copy */}
                <span className="text-[12px] text-[#abb8c9] font-extrabold text-center md:text-right">
                    © 2026 CUI Abbottabad – Department of Computer Science. All rights reserved.
                </span>

            </div>
        </footer>
    );
}