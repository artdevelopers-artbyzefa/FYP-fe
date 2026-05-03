import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faComments,
    faLightbulb,
    faFilePen,
    faUserTie,
    faCircleCheck,
    faCode,
    faAward,
    faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

const steps = [
    {
        number: "01",
        title: "Topic Selection",
        desc: "Students explore ideas, identify a problem, form a group, and prepare an initial project direction.",
        icon: faLightbulb,
    },
    {
        number: "02",
        title: "Idea Submission",
        desc: "The group submits title, abstract, objectives, tools, and expected outcomes for initial review.",
        icon: faFilePen,
    },
    {
        number: "03",
        title: "Supervisor Allocation",
        desc: "The coordinator assigns or confirms a supervisor according to domain fit and faculty availability.",
        icon: faUserTie,
    },
    {
        number: "04",
        title: "Proposal Approval",
        desc: "The proposal is reviewed, revised if needed, and approved before full implementation begins.",
        icon: faCircleCheck,
    },
    {
        number: "05",
        title: "Development Phase",
        desc: "Students build, test, document, and submit progress updates through milestones and logs.",
        icon: faCode,
    },
    {
        number: "06",
        title: "Final Defense",
        desc: "The group presents the completed work, submits the final report, and receives evaluation panel feedback.",
        icon: faAward,
    },
];

export default function Process() {
    return (
        <>
            <Header />

            <div className="font-['Segoe_UI',sans-serif] bg-white text-[#111827]">
                {/* HERO */}
                <section className="h-[630px] w-full bg-gradient-to-br from-[#cfe6ff] via-[#e3f1ff] to-[#f8fcff] flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-6 mt-10 flex justify-between items-center gap-12">
                        {/* LEFT */}
                        <div className="w-[60%]">
                            {/* BADGE */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9ecfff] bg-[#dbeeff] px-5 py-2.5 shadow-[0_6px_18px_rgba(80,150,255,0.15)]">
                                <span
                                    className="h-2.5 w-2.5 rounded-full bg-[#5aa9e6]"
                                    style={{ animation: "dotPulse 1.4s ease-in-out infinite" }}
                                ></span>

                                <FontAwesomeIcon
                                    icon={faShareNodes}
                                    className="text-[11px] text-[#214fa3]"
                                />

                                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#214fa3]">
                                    FYP WORKFLOW
                                </span>
                            </div>

                            {/* HEADING */}
                            <h1 className="text-[70px] font-black leading-[1.05] tracking-[-0.04em] text-[#0b132a]">
                                A clear lifecycle
                                <br />
                                from project idea to
                                <br />
                                final evaluation.
                            </h1>

                            {/* TEXT */}
                            <p className="mt-6 text-sm font-semibold leading-[1.8] text-gray-500 max-w-[600px]">
                                The process page gives students a practical view of each major
                                stage, the expected output, and how the portal supports progress
                                throughout the year.
                            </p>
                        </div>

                        {/* RIGHT BOX */}
                        <div className="w-[460px] h-[210px] bg-white/90 rounded-[40px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.12)] flex flex-col justify-between">
                            {/* ITEM 1 */}
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-12 h-12 aspect-square shrink-0 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3]">
                                    <FontAwesomeIcon icon={faClock} className="text-[15px]" />
                                </div>

                                <div className="pl-2">
                                    <h3 className="font-extrabold text-gray-900">
                                        Milestone Based
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                                        Each phase has clear submissions, reviews, and feedback
                                        checkpoints.
                                    </p>
                                </div>
                            </div>

                            {/* ITEM 2 */}
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-12 h-12 aspect-square shrink-0 flex items-center justify-center rounded-full bg-[#edf5ff] text-[#214fa3]">
                                    <FontAwesomeIcon icon={faComments} className="text-[15px]" />
                                </div>

                                <div className="pl-2">
                                    <h3 className="font-extrabold text-gray-900">
                                        Coordinated Review
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                                        Students, supervisors, coordinators, and evaluators stay
                                        aligned through the portal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TIMELINE */}
                <section className="bg-white px-6 pt-[88px] pb-24">
                    <div className="relative mx-auto max-w-[1180px]">
                        <div className="absolute bottom-7 left-[25px] top-7 w-0.5 bg-[#dbeeff]" />

                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="relative mb-7 flex items-center gap-[62px]"
                            >
                                <div className="z-[2] flex h-12 w-12 min-w-12 items-center justify-center rounded-full border-[1.5px] border-[#c6dcff] bg-white text-[17px] text-[#214fa3] shadow-[0_8px_20px_rgba(28,66,130,0.1)]">
                                    <FontAwesomeIcon icon={step.icon} />
                                </div>

                                <div className="min-h-[154px] flex-1 rounded-[31px] border-[1.5px] border-[#c9e0ff] bg-white p-[30px] shadow-[0_7px_16px_rgba(18,49,91,0.025)]">
                                    <p className="mb-[13px] text-xs font-black tracking-[0.16em] text-[#245fc6]">
                                        STEP {step.number}
                                    </p>

                                    <h3 className="mb-3 text-[22px] font-black leading-[1.1] tracking-[-0.04em] text-[#071327]">
                                        {step.title}
                                    </h3>

                                    <p className="text-[15.5px] font-medium leading-[1.7] text-[#5f6877]">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}