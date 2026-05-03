import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileLines,
    faBook,
    faUpload,
    faScaleBalanced,
    faTriangleExclamation,
    faCircleInfo,
    faCalendarCheck,
    faList
} from "@fortawesome/free-solid-svg-icons";

const Guidelines = () => {
    return (
        <>
            <Header />

            {/* HERO */}
            <section className="h-[630px] w-full bg-gradient-to-br from-[#cfe6ff] via-[#e3f1ff] to-[#f8fcff] flex items-center">
                <div className="max-w-7xl mx-auto w-full px-6 mt-10 flex justify-between items-center gap-12">

                    {/* LEFT */}
                    <div className="w-[60%]">

                        {/* BADGE */}
                        <div className="mb-6 inline-flex items-center text-primary gap-2 rounded-full border border-[#9ecfff] bg-[#dbeeff] px-5 py-2.5 shadow-[0_6px_18px_rgba(80,150,255,0.15)]">
                            <span
                                className="h-2.5 w-2.5 rounded-full bg-[#5aa9e6]"
                                style={{ animation: "dotPulse 1.4s ease-in-out infinite" }}
                            ></span>

                            <FontAwesomeIcon
                                icon={faBook}
                                className="text-[11px] text-[#214fa3]"
                            />

                            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#214fa3]">
                                GUIDELINES
                            </span>
                        </div>

                        {/* HEADING */}
                        <h1 className="text-[66px] tracking-wide font-black leading-[1.05] tracking-[-0.04em] text-[#0b132a]">
                            Rules and best
                            <br />
                            practices for a
                            <br />
                            smooth FYP cycle.
                        </h1>

                        {/* TEXT */}
                        <p className="mt-6 text-sm font-semibold leading-[1.8] text-gray-500 max-w-[600px]">
                            Use these guidelines to prepare submissions, follow documentation
                            standards, meet deadlines, and keep the project academically sound.
                        </p>
                    </div>

                    {/* RIGHT BOX */}
                    <div className="w-[460px] h-[210px] bg-white/90 rounded-[40px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col justify-between">

                        {/* ITEM 1 */}
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-12 h-12 aspect-square shrink-0 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3]">
                                <FontAwesomeIcon icon={faFileLines} className="text-[15px]" />
                            </div>

                            <div className="pl-2">
                                <h3 className="font-extrabold text-gray-900">
                                    Documentation
                                </h3>
                                <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                                    Keep every report, diagram, citation, and appendix complete
                                    and consistent.
                                </p>
                            </div>
                        </div>

                        {/* ITEM 2 */}
                        <div className="flex items-center gap-3 p-2">
                            <div className="w-12 h-12 aspect-square shrink-0 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3]">
                                <FontAwesomeIcon icon={faCalendarCheck} className="text-[15px]" />
                            </div>

                            <div className="pl-2">
                                <h3 className="font-extrabold text-gray-900">
                                    Deadlines
                                </h3>
                                <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                                    Late submissions can affect review scheduling and evaluation
                                    readiness.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 2 */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-[1.1fr_0.9fr] gap-10">

                    {/* LEFT SIDE */}
                    <div className="space-y-8">

                        {/* CARD 1 */}
                        <div className="rounded-[28px] border border-[#cfe4ff] p-10">
                            <div className="flex items-center gap-3 mb-7">
                                <FontAwesomeIcon icon={faFileLines} className="text-[#2463eb] text-[22px]" />
                                <h2 className="text-xl font-black text-[#0b132a]">
                                    Documentation Requirements
                                </h2>
                            </div>

                            <ul className="space-y-4 text-sm text-gray-600 list-disc pl-6">
                                <li>Use the department-approved proposal and final report structure.</li>
                                <li>Include problem statement, objectives, scope, methodology, tools, timeline, and expected outcomes.</li>
                                <li>Maintain proper citations and avoid plagiarism in all written submissions.</li>
                                <li>Attach relevant diagrams, screenshots, test results, and appendices where required.</li>
                            </ul>
                        </div>

                        {/* CARD 2 */}
                        <div className="rounded-[28px] border border-[#cfe4ff] p-10">
                            <div className="flex items-center gap-3 mb-7">
                                <FontAwesomeIcon icon={faUpload} className="text-[#2463eb] text-[22px]" />
                                <h2 className="text-xl font-black text-[#0b132a]">
                                    Submission Format
                                </h2>
                            </div>

                            <ul className="space-y-4 text-sm text-gray-600 list-disc pl-6">
                                <li>Submit documents in PDF unless another format is officially announced.</li>
                                <li>Name files clearly with group ID, project title, and submission type.</li>
                                <li>Upload source code, datasets, or supporting files only in the requested format.</li>
                                <li>Verify that all files open correctly before final submission.</li>
                            </ul>
                        </div>

                        {/* CARD 3 */}
                        <div className="rounded-[28px] border border-[#cfe4ff] p-10">
                            <div className="flex items-center gap-3 mb-7">
                                <FontAwesomeIcon icon={faScaleBalanced} className="text-[#2463eb] text-[22px]" />
                                <h2 className="text-xl font-black text-[#0b132a]">
                                    Academic Policies
                                </h2>
                            </div>

                            <ul className="space-y-4 text-sm text-gray-600 list-disc pl-6">
                                <li>All work must be original and completed by registered group members.</li>
                                <li>Major scope changes require supervisor and coordinator approval.</li>
                                <li>Students must attend scheduled reviews, demos, and final defense sessions.</li>
                                <li>Evaluation decisions are based on rubrics, deliverables, presentation, and technical quality.</li>
                            </ul>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-5">

                        <div className="rounded-[24px] border border-[#f7c84b] bg-[#fff7e6] p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#a85512] text-[18px]" />
                                <h3 className="font-black text-[#a85512]">Important Note</h3>
                            </div>

                            <p className="text-[#9a3f0d] text-sm">
                                Missing a deadline or submitting incomplete documents can delay supervisor review and may affect eligibility for evaluation.
                            </p>
                        </div>

                        <div className="rounded-[24px] border border-[#cfe4ff] bg-[#edf6ff] p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <FontAwesomeIcon icon={faCircleInfo} className="text-[#214fa3] text-[18px]" />
                                <h3 className="font-black text-[#214fa3]">Best Practice</h3>
                            </div>

                            <p className="text-[#1747a6] text-sm">
                                Meet your supervisor regularly, record feedback, update progress logs, and keep a backup of every submission.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
};

export default Guidelines;