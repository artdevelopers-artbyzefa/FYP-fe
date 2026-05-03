import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
    return (
        <>
            <Header />

            <main className="bg-white text-[#111827] pt-10">
                {/* Hero Section */}
                <section className="h-[590px] w-full bg-gradient-to-br from-[#cfe6ff] via-[#e3f1ff] to-[#f8fcff] flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-6 mt-10 flex justify-between items-center gap-15">

                        {/* LEFT CONTENT */}
                        <div className="w-[60%]">

                            {/* BADGE */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9ecfff] bg-[#dbeeff] px-5 py-2.5 shadow-[0_6px_18px_rgba(80,150,255,0.15)]">

                                <span
                                    className="h-2.5 w-2.5 rounded-full bg-[#5aa9e6]"
                                    style={{ animation: "dotPulse 1.4s ease-in-out infinite" }}
                                ></span>

                                <i className="fa-solid fa-envelope text-[13px] text-primary"></i>

                                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary">
                                    CONTACT
                                </span>
                            </div>

                            {/* HEADING */}
                            <h1 className="text-[66px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0b132a]">
                                Reach the FYP office
                                <br />for support,
                                <br />guidance, and
                                <br />coordination.
                            </h1>

                            {/* TEXT */}
                            <p className="mt-6 text-sm font-semibold leading-[1.8] text-gray-500 max-w-[600px]">
                                Use the contact form for general questions, eligibility concerns, portal
                                issues, or guidance about submissions and review schedules.
                            </p>
                        </div>


                        {/* RIGHT BOX (CONTACT CARD) */}
                        <div className="w-[470px] h-[200px] mt-12 bg-white/90 rounded-[40px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col gap-3">

                            {/* Office Hours */}
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 min-w-[40px] rounded-full bg-[#edf5ff] flex items-center justify-center text-[#214fa3]">
                                    <i className="fa-solid fa-clock text-[15px]"></i>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 leading-tight text-[15px]">
                                        Office Hours
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-500 leading-relaxed mt-1">
                                        Monday to Friday, 08:30 AM to 04:30 PM.
                                    </p>
                                </div>
                            </div>

                            {/* Support Scope */}
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 min-w-[40px] rounded-full bg-[#edf5ff] flex items-center justify-center text-[#214fa3]">
                                    <i className="fa-solid fa-reply text-[15px]"></i>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 leading-tight text-[15px]">
                                        Support Scope
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-500 leading-relaxed mt-1">
                                        Eligibility, deadlines, portal access, proposal review, and
                                        evaluation coordination.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* Content */}
                <section className="py-24">
                    <div className="max-w-[1280px] mx-auto px-8 grid lg:grid-cols-2 gap-10">

                        {/* Form */}
                        <div className="border rounded-[30px] p-8">
                            <p className="text-blue-600 font-bold text-sm tracking-widest mb-4">
                                SEND MESSAGE
                            </p>

                            <h2 className="text-3xl font-black mb-6">
                                How can we help?
                            </h2>

                            <form className="space-y-5 text-sm">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full border rounded-xl p-3"
                                />

                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full border rounded-xl p-3"
                                />

                                <textarea
                                    rows="4"
                                    placeholder="Write your message"
                                    className="w-full border rounded-xl p-3 text-primary"
                                />

                                <button className="w-full h-[33px] bg-primary font-semibold text-sm text-white py-3 rounded-full flex justify-center items-center gap-2">
                                    Submit Query
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>

                        {/* Right Side */}
                        <div className="space-y-6">

                            {/* Details */}
                            <div className="border rounded-[30px] p-8">
                                <p className="text-blue-600 font-bold text-sm tracking-widest mb-6">
                                    OFFICIAL DETAILS
                                </p>

                                <div className="space-y-6">
                                    <InfoItem icon="fa-envelope" title="Email" text="csfyp@cuiatd.edu.pk" />
                                    <InfoItem icon="fa-phone" title="Phone" text="+92-992-383591 Ext. 240" />
                                    <InfoItem icon="fa-location-dot" title="Address" text="FYP Office, CS Department, COMSATS University Islamabad, Abbottabad Campus" />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="border rounded-[30px] p-8 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:30px_30px]">

                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-4">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>

                                <h3 className="text-xl font-bold mb-2">Campus Location</h3>

                                <p className="text-gray-500 text-sm">
                                    Use the official university website or campus contact desk for precise route guidance and visitor information.
                                </p>

                            </div>
                        </div>

                    </div>
                </section>
            </main >

            <Footer />
        </>
    );
};

const InfoItem = ({ icon, title, text }) => (
    <div className="flex gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#2446a2]">
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-gray-500 text-sm">{text}</p>
        </div>
    </div>
);

export default Contact;