import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGraduationCap,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const [active, setActive] = useState("");

    const navLinks = [
        "About",
        "Eligibility",
        "Process",
        "Guidelines",
        "Team",
        "FAQ",
        "Contact",
    ];

    return (
        <header className="w-full h-[80px] bg-white shadow-[0_1px_14px_rgba(15,23,42,0.06)]">
            <div className="flex h-full w-full items-center justify-between">
                {/* LOGO */}
                <div className="ml-[80px] flex items-center gap-4">
                    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#1e3a8a] text-white shadow-sm">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-[24px]" />
                    </div>

                    <div className="leading-none">
                        <h2 className="text-[21px] font-black tracking-[-0.03em] text-[#1e3a8a]">
                            CUI Abbottabad
                        </h2>

                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-sky-500">
                            FYP PORTAL
                        </p>
                    </div>
                </div>

                {/* NAV LINKS */}
                <nav className="hidden items-center gap-9 lg:flex">
                    {navLinks.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActive(item)}
                            className={`text-[15px] font-bold transition-colors duration-200 ${active === item
                                ? "text-[#1e3a8a]"
                                : "text-gray-500 hover:text-[#1e3a8a]"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                {/* BUTTON */}
                <button className="mr-[80px] hidden h-[40px] min-w-[175px] items-center justify-center gap-3 rounded-full bg-[#1e3a8a] px-9 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(30,58,138,0.3)] transition hover:bg-[#162f74] sm:flex">
                    Portal Login
                    <FontAwesomeIcon icon={faArrowRight} className="text-[14px]" />
                </button>
            </div>
        </header>
    );
}