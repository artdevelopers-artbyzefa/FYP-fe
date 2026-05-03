import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleQuestion,
    faMagnifyingGlass,
    faHeadset,
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const faqs = [
    {
        question: "Who is eligible to enroll in FYP?",
        answer:
            "Students who meet the department's credit hour, prerequisite course, CGPA, and registration requirements can enroll. Confirm your status before forming a group.",
    },
    {
        question: "How do we submit a project idea?",
        answer:
            "Project ideas are submitted through the FYP portal according to the announced proposal submission timeline.",
    },
    {
        question: "Can students choose their supervisor?",
        answer:
            "Students may suggest or request a supervisor, but final allocation depends on availability, department policy, and project relevance.",
    },
    {
        question: "Where are deadlines announced?",
        answer:
            "Deadlines are announced through the FYP portal and official department communication channels.",
    },
    {
        question: "What happens after proposal approval?",
        answer:
            "After approval, students continue with implementation, milestone submissions, supervisor meetings, and scheduled progress reviews.",
    },
    {
        question: "How is final evaluation handled?",
        answer:
            "Final evaluation is conducted by assigned evaluators based on project work, documentation, presentation, and viva performance.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <>
            <Header />

            <main className="w-full bg-white">

                {/* HERO */}
                <section className="h-[630px] w-full bg-gradient-to-br from-[#cfe6ff] via-[#e3f1ff] to-[#f8fcff] flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-6 mt-10 flex justify-between items-center gap-15">

                        <div className="w-[60%]">

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9ecfff] bg-[#dbeeff] px-5 py-2.5 shadow-[0_6px_18px_rgba(80,150,255,0.15)]">
                                <span
                                    className="h-2.5 w-2.5 rounded-full bg-[#5aa9e6]"
                                    style={{ animation: "dotPulse 1.4s ease-in-out infinite" }}
                                ></span>

                                <FontAwesomeIcon icon={faCircleQuestion} className="text-[11px] text-primary" />

                                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary">
                                    FAQ
                                </span>
                            </div>

                            <h1 className="text-[68px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#0b132a]">
                                Quick answers to <br />
                                common FYP <br />
                                questions.
                            </h1>

                            <p className="mt-6 text-sm font-semibold leading-[1.8] text-gray-500 max-w-[600px]">
                                Find guidance on eligibility, submissions, supervisor coordination,
                                deadlines, reviews, and how students should use the portal.
                            </p>
                        </div>

                        {/* RIGHT BOX */}
                        <div className="w-[460px] h-[210px] bg-white/90 rounded-[40px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col justify-between">

                            {/* ITEM 1 */}
                            <div className="flex gap-3 p-2 items-center">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3] shrink-0">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[16px]" />
                                </div>

                                <div className="pl-2">
                                    <h3 className="font-extrabold text-gray-900">Scan Faster</h3>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Expand only the questions you need and keep the rest collapsed.
                                    </p>
                                </div>
                            </div>

                            {/* ITEM 2 */}
                            <div className="flex gap-3 p-2 items-center">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3] shrink-0">
                                    <FontAwesomeIcon icon={faHeadset} className="text-[16px]" />
                                </div>

                                <div className="pl-2">
                                    <h3 className="font-extrabold text-gray-900">Still Unsure?</h3>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Contact the FYP office for department-specific decisions or unusual cases.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* FAQ LIST */}
                <section className="w-full bg-white py-[120px]">
                    <div className="max-w-[1140px] mx-auto px-6">
                        <div className="flex flex-col gap-5">
                            {faqs.map((item, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className={`rounded-[26px] border border-[#cfe5ff] bg-white transition-all duration-300 ${isOpen ? "py-8 px-8" : "py-6 px-8"
                                            }`}
                                    >
                                        <button
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                            className="w-full flex justify-between"
                                        >
                                            <h3 className="text-[18px] font-black text-[#071126]">
                                                {item.question}
                                            </h3>

                                            <FontAwesomeIcon
                                                icon={isOpen ? faChevronUp : faChevronDown}
                                                className="text-[#214fa3]"
                                            />
                                        </button>

                                        {isOpen && (
                                            <p className="mt-7 text-[15px] text-gray-600">
                                                {item.answer}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <style>
                    {`
                        @keyframes dotPulse {
                            0%,100%{opacity:1;transform:scale(1);}
                            50%{opacity:0.45;transform:scale(1.35);}
                        }
                    `}
                </style>
            </main>

            <Footer />
        </>
    );
};

export default FAQ;