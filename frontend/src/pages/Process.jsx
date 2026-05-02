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
        <div style={styles.page}>
            <Header />

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    <div style={styles.heroLeft}>
                        <div style={styles.badge}>
                            <span style={styles.dot}></span>

                            <span style={styles.badgeIcon}>
                                <FontAwesomeIcon icon={faShareNodes} />
                            </span>

                            <span style={styles.badgeText}>FYP WORKFLOW</span>
                        </div>

                        <h1 style={styles.heroHeading}>
                            A clear lifecycle
                            <br />
                            from project idea to
                            <br />
                            final evaluation.
                        </h1>

                        <p style={styles.heroSubtext}>
                            The process page gives students a practical view of each major
                            stage, the expected output, and how the portal supports progress
                            throughout the year.
                        </p>
                    </div>

                    <div style={styles.heroCard}>
                        <div style={styles.featureRow}>
                            <div style={styles.featureIcon}>
                                <FontAwesomeIcon icon={faClock} />
                            </div>

                            <div>
                                <div style={styles.featureTitle}>Milestone Based</div>
                                <div style={styles.featureDesc}>
                                    Each phase has clear submissions, reviews, and feedback
                                    checkpoints.
                                </div>
                            </div>
                        </div>

                        <div style={styles.featureRow}>
                            <div style={styles.featureIcon}>
                                <FontAwesomeIcon icon={faComments} />
                            </div>

                            <div>
                                <div style={styles.featureTitle}>Coordinated Review</div>
                                <div style={styles.featureDesc}>
                                    Students, supervisors, coordinators, and evaluators stay
                                    aligned through the portal.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section style={styles.stepsSection}>
                <div style={styles.stepsWrap}>
                    <div style={styles.timelineLine}></div>

                    {steps.map((step) => (
                        <div key={step.number} style={styles.stepRow}>
                            <div style={styles.stepIcon}>
                                <FontAwesomeIcon icon={step.icon} />
                            </div>

                            <div style={styles.stepCard}>
                                <p style={styles.stepNumber}>STEP {step.number}</p>
                                <h3 style={styles.stepTitle}>{step.title}</h3>
                                <p style={styles.stepDesc}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#ffffff",
        color: "#111827",
    },

    hero: {
        background:
            "linear-gradient(160deg, #dbe9ff 0%, #eef4ff 50%, #f0f4ff 100%)",
        padding: "70px 20px 90px",
    },

    heroInner: {
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
    },

    heroLeft: {
        flex: "1 1 560px",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",

        /* size chota */
        padding: "8px 18px",

        borderRadius: "999px",

        /* exact light gradient like image */
        background: "linear-gradient(180deg, #f3f7ff 0%, #e6f0ff 100%)",

        border: "1px solid #cfe0ff",

        boxShadow: "0 2px 6px rgba(59,130,246,0.08)",
    },

    dot: {
        width: "9px",
        height: "9px",
        borderRadius: "50%",
        backgroundColor: "#3b82f6",
    },

    badgeIcon: {
        width: "22px",
        height: "22px",
        borderRadius: "50%",

        /* icon background subtle */
        backgroundColor: "#edf4ff",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: "#1e3a8a",
        fontSize: "11px",
    },

    badgeText: {
        fontSize: "13px",   // smaller
        fontWeight: "900",
        letterSpacing: "0.18em",
        color: "#1e3a8a",
    },



    heroHeading: {
        fontSize: "clamp(44px, 6vw, 72px)",
        fontWeight: "950",
        lineHeight: "0.98",
        letterSpacing: "-0.045em",
        color: "#071a3d",
        marginBottom: "24px",
    },

    heroSubtext: {
        fontSize: "17px",
        color: "#4b5563",
        lineHeight: "1.7",
        maxWidth: "620px",
    },

    heroCard: {
        flex: "0 1 430px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "28px",
        padding: "34px",
        boxShadow: "0 24px 55px rgba(15,43,88,0.14)",
        alignSelf: "center",
    },

    featureRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        marginBottom: "20px",
    },

    featureIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        backgroundColor: "#eff6ff",
        color: "#1e3a8a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "17px",
        flexShrink: 0,
    },

    featureTitle: {
        fontSize: "16px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "4px",
    },

    featureDesc: {
        fontSize: "14px",
        color: "#6b7280",
        lineHeight: "1.6",
    },

    stepsSection: {
        backgroundColor: "#ffffff",
        padding: "88px 24px 96px",
    },

    stepsWrap: {
        maxWidth: "1180px",
        margin: "0 auto",
        position: "relative",
    },

    timelineLine: {
        position: "absolute",
        left: "25px",
        top: "28px",
        bottom: "28px",
        width: "2px",
        backgroundColor: "#dbeeff",
    },

    stepRow: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "62px",
        marginBottom: "28px",
    },

    stepIcon: {
        width: "48px",
        height: "48px",
        minWidth: "48px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        border: "1px solid #dbeeff",
        boxShadow: "0 8px 20px rgba(28, 66, 130, 0.1)",
        color: "#214fa3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "17px",
        zIndex: 2,
    },

    stepCard: {
        flex: 1,
        minHeight: "154px",
        border: "1px solid #d9eafa",
        borderRadius: "31px",
        backgroundColor: "#ffffff",
        boxShadow: "0 7px 16px rgba(18, 49, 91, 0.025)",
        padding: "30px",
    },

    stepNumber: {
        margin: "0 0 13px",
        color: "#245fc6",
        fontSize: "12px",
        fontWeight: "900",
        letterSpacing: "0.16em",
    },

    stepTitle: {
        margin: "0 0 12px",
        color: "#071327",
        fontSize: "22px",
        lineHeight: "1.1",
        fontWeight: "900",
        letterSpacing: "-0.04em",
    },

    stepDesc: {
        margin: 0,
        color: "#5f6877",
        fontSize: "15.5px",
        lineHeight: "1.7",
        fontWeight: "500",
    },
};