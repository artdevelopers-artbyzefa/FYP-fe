import React from "react";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-black bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-3">
                    <img src="/cuilogo.png" alt="CUI" className="h-[32px] w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                    <span className="text-[13px] font-black text-black tracking-[0.1em]">CUI FYP System</span>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    <a href="#" className="text-[13px] font-bold text-black no-underline transition-colors hover:text-blue-600">Privacy Policy</a>
                    <a href="#" className="text-[13px] font-bold text-black no-underline transition-colors hover:text-blue-600">Terms of Service</a>
                    <a href="#" className="text-[13px] font-bold text-black no-underline transition-colors hover:text-blue-600">Accessibility</a>
                </div>
                <div className="text-[12px] font-semibold text-black">
                    © 2026 CUI Abbottabad — Department of Computer Science. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
