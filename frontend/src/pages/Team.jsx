import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCode,
    faLayerGroup,
    faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Team = () => {
    return (
        <>
            <Header />
            <main className="bg-white text-[#111827] pt-10">

                {/* HERO SECTION */}
                <section className="h-[600px] w-full bg-gradient-to-br from-[#cfe6ff] via-[#e3f1ff] to-[#f8fcff] flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-6 mt-10 flex justify-between items-center gap-10">

                        {/* LEFT CONTENT */}
                        <div className="w-[60%]">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9ecfff] bg-[#dbeeff] px-5 py-2.5 shadow-[0_6px_18px_rgba(80,150,255,0.15)]">
                                <span
                                    className="h-2.5 w-2.5 rounded-full bg-[#5aa9e6]"
                                    style={{ animation: "dotPulse 1.4s ease-in-out infinite" }}
                                ></span>

                                <FontAwesomeIcon
                                    icon={faCode}
                                    className="text-[11px] text-[#214fa3]"
                                />

                                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#214fa3]">
                                    OUR DEVELOPERS
                                </span>
                            </div>

                            <h1 className="text-[64px]  tracking-wide font-black leading-[1.05] tracking-[-0.04em] text-[#0b132a]">
                                The team building a cleaner FYP management experience.
                            </h1>

                            <p className="mt-6 text-sm font-semibold leading-[1.8] text-gray-500 max-w-[600px]">
                                This page highlights the developers responsible for designing,
                                implementing, and refining the portal workflows used by students,
                                supervisors, evaluators, and coordinators.
                            </p>
                        </div>

                        {/* RIGHT BOX */}
                        <div className="w-[460px] h-[210px] bg-white/90 rounded-[40px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col justify-between">

                            {/* Item 1 */}
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-12 h-12 aspect-square shrink-0 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3]">
                                    <FontAwesomeIcon icon={faLayerGroup} className="text-[16px]" />
                                </div>

                                <div className="pl-2">
                                    <h3 className="font-extrabold text-gray-900">
                                        Product Thinking
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Focused on practical academic workflows and usable interfaces.
                                    </p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-12 h-12 aspect-square shrink-0 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3]">
                                    <FontAwesomeIcon icon={faShieldHalved} className="text-[16px]" />
                                </div>

                                <div className="pl-2">
                                    <h3 className="font-extrabold text-gray-900">
                                        Reliable Delivery
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Built around role-based modules, structured submissions, and
                                        evaluation support.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* TEAM CARDS */}
                <section className="py-20 bg-[#f7f9fc]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-10 items-stretch">

                        {/* CARD 1 */}
                        <div className="bg-white rounded-[30px] border border-gray-300 p-10 text-center shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,60,150,0.25)] hover:border-[#5aa9e6] flex flex-col h-full">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#082f75] via-[#0b3c91] to-[#3f8fdc] flex items-center justify-center text-white text-2xl font-bold">
                                AD
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-gray-900">Ali Danish</h3>

                            <p className="text-xs font-bold tracking-widest text-[#2f5bd3] mt-1">
                                FRONTEND DEVELOPER
                            </p>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                Designed responsive screens, landing pages, reusable UI patterns,
                                and the student-facing portal experience.
                            </p>

                            <div className="flex justify-center gap-4 mt-auto pt-6">
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#dbeeff] hover:to-[#edf5ff]"
                                >
                                    <FontAwesomeIcon
                                        icon={faGithub}
                                        className="text-gray-500 text-[16px] transition-colors duration-300 group-hover:text-[#0b3c91]"
                                    />
                                </a>

                                <a
                                    href="https://linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#dbeeff] hover:to-[#edf5ff]"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedin}
                                        className="text-gray-500 text-[16px] transition-colors duration-300 group-hover:text-[#0b3c91]"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* CARD 2 */}
                        <div className="bg-white rounded-[30px] border border-gray-300 p-10 text-center shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,60,150,0.25)] hover:border-[#5aa9e6] flex flex-col h-full">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#082f75] via-[#0b3c91] to-[#3f8fdc] flex items-center justify-center text-white text-2xl font-bold">
                                MH
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-gray-900">Maham Hassan</h3>

                            <p className="text-xs font-bold tracking-widest text-[#2f5bd3] mt-1">
                                BACKEND DEVELOPER
                            </p>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                Worked on data handling concepts, authentication flow, project
                                records, and role-specific portal behavior.
                            </p>

                            <div className="flex justify-center gap-4 mt-auto pt-6">
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#dbeeff] hover:to-[#edf5ff]"
                                >
                                    <FontAwesomeIcon
                                        icon={faGithub}
                                        className="text-gray-500 text-[16px] transition-colors duration-300 group-hover:text-[#0b3c91]"
                                    />
                                </a>

                                <a
                                    href="https://linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#dbeeff] hover:to-[#edf5ff]"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedin}
                                        className="text-gray-500 text-[16px] transition-colors duration-300 group-hover:text-[#0b3c91]"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* CARD 3 */}
                        <div className="bg-white rounded-[30px] border border-gray-300 p-10 text-center shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,60,150,0.25)] hover:border-[#5aa9e6] flex flex-col h-full">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#082f75] via-[#0b3c91] to-[#3f8fdc] flex items-center justify-center text-white text-2xl font-bold">
                                SK
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-gray-900">Saad Khan</h3>

                            <p className="text-xs font-bold tracking-widest text-[#2f5bd3] mt-1">
                                PROJECT COORDINATOR
                            </p>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                Managed workflow mapping, documentation structure, testing
                                coordination, and evaluation module planning.
                            </p>

                            <div className="flex justify-center gap-4 mt-auto pt-6">
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#dbeeff] hover:to-[#edf5ff]"
                                >
                                    <FontAwesomeIcon
                                        icon={faGithub}
                                        className="text-gray-500 text-[16px] transition-colors duration-300 group-hover:text-[#0b3c91]"
                                    />
                                </a>

                                <a
                                    href="https://linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 bg-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-gradient-to-br hover:from-[#dbeeff] hover:to-[#edf5ff]"
                                >
                                    <FontAwesomeIcon
                                        icon={faLinkedin}
                                        className="text-gray-500 text-[16px] transition-colors duration-300 group-hover:text-[#0b3c91]"
                                    />
                                </a>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Team;