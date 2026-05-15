import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Eligibility", href: "/eligibility" },
        { name: "Process", href: "/process" },
        { name: "Guidelines", href: "/guidelines" },
        { name: "Team", href: "/team" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-[14px] border-b border-blue-100 transition-shadow duration-200 ${scrolled ? "shadow-[0_4px_24px_rgba(30,58,138,0.08)]" : ""
                }`}
        >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[64px] sm:h-[72px] flex items-center justify-between gap-4">

                {/* LOGO + TEXT */}
                <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
                    <img src="/cuilogo.png" alt="CUI Logo" className="h-[44px] w-auto" />
                    <div className="flex flex-col">
                        <span className="text-[0.95rem] font-black text-primary leading-[1.2]">
                            CUI Abbottabad
                        </span>
                        <span className="text-[0.6rem] font-bold text-blue-400 uppercase tracking-[0.2em] leading-[1.2]">
                            FYP Portal
                        </span>
                    </div>
                </Link>

                {/* NAV LINKS */}
                <div className="hidden lg:flex items-center gap-4">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`text-[13px] font-bold no-underline transition-colors duration-150 ${
                                location.pathname === item.href ? "text-primary" : "text-gray-500 hover:text-primary"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3">

                    {/* DESKTOP BUTTON */}
                    <Link
                        to="/login"
                        className="hidden sm:inline-flex items-center justify-center gap-2 h-[32px] px-5 rounded-full text-[13px] font-bold bg-primary text-white shadow-[0_8px_24px_rgba(30,58,138,0.18)] hover:bg-blue-800 active:bg-blue-900 transition-all whitespace-nowrap"
                    >
                        Portal Login <i className="fas fa-arrow-right"></i>
                    </Link>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden w-[40px] h-[40px] rounded-lg bg-white border-[1.5px] border-blue-100 text-primary flex items-center justify-center cursor-pointer text-base transition-all hover:bg-blue-50"
                    >
                        <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`lg:hidden overflow-hidden bg-white border-t border-blue-100 transition-all duration-300 ${mobileMenuOpen ? "max-h-[640px]" : "max-h-0"
                    }`}
            >
                <div className="p-4 sm:p-6 flex flex-col gap-2">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-3 px-3 rounded-lg text-[13px] font-bold no-underline transition-all ${
                                location.pathname === item.href ? "bg-blue-50 text-primary" : "text-gray-700 hover:bg-blue-50 hover:text-primary"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* MOBILE BUTTON */}
                    <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex sm:hidden items-center justify-center gap-2 h-[44px] px-5 rounded-xl text-[13px] font-bold bg-primary text-white shadow-lg transition-all whitespace-nowrap"
                    >
                        Portal Login <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
