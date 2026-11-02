import { useMemo, useState } from "react";
import {
    Button,
    Card,
    Input,
    Tabs,
    Tag,
    Typography,
    Space,
    Progress,
    message,
} from "antd";

import {
    FileTextOutlined,
    RobotOutlined,
    ThunderboltOutlined,
    DownloadOutlined,
    PlusOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

import { improveResumeContent } from "../../services/resumeApi";
import "../../styles/resume-maker.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function ResumeMaker() {
    const [activeTab, setActiveTab] = useState("builder");
    const [loadingAI, setLoadingAI] = useState(false);

    const [resume, setResume] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",

        summary: "",
        skills: "",

        experience: [
            {
                company: "",
                role: "",
                duration: "",
                description: "",
            },
        ],

        education: [
            {
                degree: "",
                college: "",
                year: "",
            },
        ],

        projects: [
            {
                name: "",
                technologies: "",
                description: "",
            },
        ],

        certifications: "",
    });

    const [jobDescription, setJobDescription] = useState("");

    const updateField = (field, value) => {
        setResume((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateArrayField = (section, index, field, value) => {
        setResume((prev) => ({
            ...prev,
            [section]: prev[section].map((item, i) =>
                i === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            ),
        }));
    };

    const addItem = (section, item) => {
        setResume((prev) => ({
            ...prev,
            [section]: [...prev[section], item],
        }));
    };

    const removeItem = (section, index) => {
        setResume((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    };

    // -----------------------------
    // ATS SCORE
    // -----------------------------

    const atsScore = useMemo(() => {
        let score = 0;

        if (resume.name.trim()) score += 10;
        if (resume.role.trim()) score += 10;
        if (resume.email.trim()) score += 5;
        if (resume.phone.trim()) score += 5;
        if (resume.summary.trim().length >= 50) score += 15;
        if (resume.skills.trim()) score += 15;

        if (
            resume.experience.some(
                (item) =>
                    item.company.trim() &&
                    item.role.trim() &&
                    item.description.trim()
            )
        ) {
            score += 15;
        }

        if (
            resume.education.some(
                (item) =>
                    item.degree.trim() &&
                    item.college.trim()
            )
        ) {
            score += 10;
        }

        if (
            resume.projects.some(
                (item) =>
                    item.name.trim() &&
                    item.description.trim()
            )
        ) {
            score += 10;
        }

        return Math.min(score, 100);
    }, [resume]);

    // -----------------------------
    // JOB DESCRIPTION MATCH
    // -----------------------------

    const matchKeywords = useMemo(() => {
        if (!jobDescription.trim()) {
            return {
                matched: [],
                missing: [],
            };
        }

        const resumeText = `
            ${resume.summary}
            ${resume.skills}
            ${resume.role}
            ${resume.experience
                .map((e) => `${e.role} ${e.description}`)
                .join(" ")}
            ${resume.projects
                .map((p) => `${p.name} ${p.technologies} ${p.description}`)
                .join(" ")}
        `.toLowerCase();

        const keywords = [
            ...new Set(
                jobDescription
                    .toLowerCase()
                    .match(/[a-zA-Z][a-zA-Z+#.-]{2,}/g) || []
            ),
        ];

        const ignoredWords = new Set([
            "the",
            "and",
            "for",
            "with",
            "that",
            "this",
            "are",
            "you",
            "your",
            "from",
            "will",
            "have",
            "has",
            "our",
            "job",
            "role",
            "work",
            "years",
            "into",
            "using",
            "about",
            "looking",
            "required",
        ]);

        const usefulKeywords = keywords.filter(
            (word) => !ignoredWords.has(word)
        );

        const matched = usefulKeywords.filter((word) =>
            resumeText.includes(word)
        );

        const missing = usefulKeywords.filter(
            (word) => !resumeText.includes(word)
        );

        return {
            matched: [...new Set(matched)],
            missing: [...new Set(missing)],
        };
    }, [jobDescription, resume]);

    // -----------------------------
    // AI IMPROVEMENT
    // -----------------------------

    const improveSummary = async () => {
        if (!resume.summary.trim()) {
            message.warning("Please write your summary first.");
            return;
        }

        try {
            setLoadingAI(true);

            const improved = await improveResumeContent(
                "professional summary",
                resume.summary,
                resume.role,
                jobDescription
            );

            updateField("summary", improved);

            message.success("AI improved your summary!");
        } catch (error) {
            console.error(error);
            message.error("AI improvement failed.");
        } finally {
            setLoadingAI(false);
        }
    };

    // -----------------------------
    // DOWNLOAD
    // -----------------------------

    const downloadResume = () => {
        window.print();
    };

    return (
        <div className="resume-maker">

            {/* HEADER */}

            <div className="resume-maker-header">

                <div>
                    <Tag color="blue">
                        <FileTextOutlined /> AI Resume Maker
                    </Tag>

                    <Title level={2}>
                        Build an ATS-Friendly Resume
                    </Title>

                    <Paragraph>
                        Create a professional resume, optimize it for ATS,
                        match it with job descriptions and improve your
                        content using AI.
                    </Paragraph>
                </div>

                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={downloadResume}
                >
                    Download Resume
                </Button>

            </div>

            {/* MAIN WORKSPACE */}

            <div className="resume-workspace">

                {/* LEFT SIDE */}

                <div className="resume-editor">

                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: "builder",
                                label: (
                                    <>
                                        <FileTextOutlined /> Resume Builder
                                    </>
                                ),
                                children: (
                                    <BuilderTab
                                        resume={resume}
                                        updateField={updateField}
                                        updateArrayField={
                                            updateArrayField
                                        }
                                        addItem={addItem}
                                        removeItem={removeItem}
                                        improveSummary={
                                            improveSummary
                                        }
                                        loadingAI={loadingAI}
                                    />
                                ),
                            },

                            {
                                key: "ats",
                                label: (
                                    <>
                                        <ThunderboltOutlined /> ATS
                                        Optimization
                                    </>
                                ),
                                children: (
                                    <ATSTab
                                        score={atsScore}
                                        resume={resume}
                                    />
                                ),
                            },

                            {
                                key: "matcher",
                                label: (
                                    <>
                                        <RobotOutlined /> Job Matcher
                                    </>
                                ),
                                children: (
                                    <MatcherTab
                                        jobDescription={
                                            jobDescription
                                        }
                                        setJobDescription={
                                            setJobDescription
                                        }
                                        matchKeywords={
                                            matchKeywords
                                        }
                                    />
                                ),
                            },
                        ]}
                    />

                </div>

                {/* RIGHT SIDE */}

                <div className="resume-preview-wrapper">

                    <div className="preview-title">
                        <Text strong>
                            Live Resume Preview
                        </Text>

                        <Tag color="green">
                            ATS Ready
                        </Tag>
                    </div>

                    <ResumePreview resume={resume} />

                </div>

            </div>

        </div>
    );
}

// ======================================================
// BUILDER TAB
// ======================================================

function BuilderTab({
    resume,
    updateField,
    updateArrayField,
    addItem,
    removeItem,
    improveSummary,
    loadingAI,
}) {
    return (
        <div className="builder-content">

            {/* PERSONAL INFORMATION */}

            <Card title="Personal Information">

                <div className="form-grid">

                    <Input
                        placeholder="Full Name"
                        value={resume.name}
                        onChange={(e) =>
                            updateField(
                                "name",
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Target Job Role"
                        value={resume.role}
                        onChange={(e) =>
                            updateField(
                                "role",
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Email"
                        value={resume.email}
                        onChange={(e) =>
                            updateField(
                                "email",
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Phone"
                        value={resume.phone}
                        onChange={(e) =>
                            updateField(
                                "phone",
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="Location"
                        value={resume.location}
                        onChange={(e) =>
                            updateField(
                                "location",
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="LinkedIn URL"
                        value={resume.linkedin}
                        onChange={(e) =>
                            updateField(
                                "linkedin",
                                e.target.value
                            )
                        }
                    />

                    <Input
                        placeholder="GitHub URL"
                        value={resume.github}
                        onChange={(e) =>
                            updateField(
                                "github",
                                e.target.value
                            )
                        }
                    />

                </div>

            </Card>

            {/* SUMMARY */}

            <Card
                title="Professional Summary"
                className="resume-section-card"
            >

                <TextArea
                    rows={6}
                    placeholder="Write a professional summary..."
                    value={resume.summary}
                    onChange={(e) =>
                        updateField(
                            "summary",
                            e.target.value
                        )
                    }
                />

                <div className="ai-action">
                    <Button
                        type="primary"
                        icon={<RobotOutlined />}
                        loading={loadingAI}
                        onClick={improveSummary}
                    >
                        Improve with AI
                    </Button>
                </div>

            </Card>

            {/* SKILLS */}

            <Card
                title="Skills"
                className="resume-section-card"
            >

                <TextArea
                    rows={4}
                    placeholder="Java, Spring Boot, React, SQL, Git..."
                    value={resume.skills}
                    onChange={(e) =>
                        updateField(
                            "skills",
                            e.target.value
                        )
                    }
                />

            </Card>

            {/* EXPERIENCE */}

            <Card
                title="Experience"
                className="resume-section-card"
            >

                {resume.experience.map((item, index) => (

                    <div
                        className="dynamic-item"
                        key={index}
                    >

                        <div className="form-grid">

                            <Input
                                placeholder="Company"
                                value={item.company}
                                onChange={(e) =>
                                    updateArrayField(
                                        "experience",
                                        index,
                                        "company",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Job Title"
                                value={item.role}
                                onChange={(e) =>
                                    updateArrayField(
                                        "experience",
                                        index,
                                        "role",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Duration"
                                value={item.duration}
                                onChange={(e) =>
                                    updateArrayField(
                                        "experience",
                                        index,
                                        "duration",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <TextArea
                            rows={5}
                            placeholder="Describe your responsibilities and achievements..."
                            value={item.description}
                            onChange={(e) =>
                                updateArrayField(
                                    "experience",
                                    index,
                                    "description",
                                    e.target.value
                                )
                            }
                        />

                        {resume.experience.length > 1 && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                    removeItem(
                                        "experience",
                                        index
                                    )
                                }
                            >
                                Remove
                            </Button>
                        )}

                    </div>

                ))}

                <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                        addItem("experience", {
                            company: "",
                            role: "",
                            duration: "",
                            description: "",
                        })
                    }
                >
                    Add Experience
                </Button>

            </Card>

            {/* EDUCATION */}

            <Card
                title="Education"
                className="resume-section-card"
            >

                {resume.education.map((item, index) => (

                    <div
                        className="dynamic-item"
                        key={index}
                    >

                        <div className="form-grid">

                            <Input
                                placeholder="Degree"
                                value={item.degree}
                                onChange={(e) =>
                                    updateArrayField(
                                        "education",
                                        index,
                                        "degree",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="College / University"
                                value={item.college}
                                onChange={(e) =>
                                    updateArrayField(
                                        "education",
                                        index,
                                        "college",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Year"
                                value={item.year}
                                onChange={(e) =>
                                    updateArrayField(
                                        "education",
                                        index,
                                        "year",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {resume.education.length > 1 && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                    removeItem(
                                        "education",
                                        index
                                    )
                                }
                            >
                                Remove
                            </Button>
                        )}

                    </div>

                ))}

                <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                        addItem("education", {
                            degree: "",
                            college: "",
                            year: "",
                        })
                    }
                >
                    Add Education
                </Button>

            </Card>

            {/* PROJECTS */}

            <Card
                title="Projects"
                className="resume-section-card"
            >

                {resume.projects.map((item, index) => (

                    <div
                        className="dynamic-item"
                        key={index}
                    >

                        <Input
                            placeholder="Project Name"
                            value={item.name}
                            onChange={(e) =>
                                updateArrayField(
                                    "projects",
                                    index,
                                    "name",
                                    e.target.value
                                )
                            }
                        />

                        <Input
                            placeholder="Technologies Used"
                            value={item.technologies}
                            onChange={(e) =>
                                updateArrayField(
                                    "projects",
                                    index,
                                    "technologies",
                                    e.target.value
                                )
                            }
                        />

                        <TextArea
                            rows={4}
                            placeholder="Project description..."
                            value={item.description}
                            onChange={(e) =>
                                updateArrayField(
                                    "projects",
                                    index,
                                    "description",
                                    e.target.value
                                )
                            }
                        />

                        {resume.projects.length > 1 && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                    removeItem(
                                        "projects",
                                        index
                                    )
                                }
                            >
                                Remove
                            </Button>
                        )}

                    </div>

                ))}

                <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                        addItem("projects", {
                            name: "",
                            technologies: "",
                            description: "",
                        })
                    }
                >
                    Add Project
                </Button>

            </Card>

            {/* CERTIFICATIONS */}

            <Card
                title="Certifications"
                className="resume-section-card"
            >

                <TextArea
                    rows={4}
                    placeholder="Java Certification, AWS Certification, etc."
                    value={resume.certifications}
                    onChange={(e) =>
                        updateField(
                            "certifications",
                            e.target.value
                        )
                    }
                />

            </Card>

        </div>
    );
}

// ======================================================
// ATS TAB
// ======================================================

function ATSTab({ score, resume }) {
    return (
        <div className="ats-panel">

            <Card>

                <div className="ats-score">

                    <Progress
                        type="circle"
                        percent={score}
                        size={180}
                    />

                    <div>
                        <Title level={3}>
                            ATS Compatibility
                        </Title>

                        <Paragraph>
                            Your resume is currently
                            {score}% complete from an ATS
                            structure perspective.
                        </Paragraph>
                    </div>

                </div>

            </Card>

            <Card title="ATS Checklist">

                <ATSCheck
                    completed={!!resume.name}
                    text="Full name added"
                />

                <ATSCheck
                    completed={!!resume.role}
                    text="Target job role added"
                />

                <ATSCheck
                    completed={!!resume.summary}
                    text="Professional summary added"
                />

                <ATSCheck
                    completed={!!resume.skills}
                    text="Skills added"
                />

                <ATSCheck
                    completed={resume.experience.some(
                        (x) =>
                            x.company &&
                            x.description
                    )}
                    text="Experience section completed"
                />

                <ATSCheck
                    completed={resume.education.some(
                        (x) =>
                            x.degree &&
                            x.college
                    )}
                    text="Education section completed"
                />

                <ATSCheck
                    completed={resume.projects.some(
                        (x) =>
                            x.name &&
                            x.description
                    )}
                    text="Projects section completed"
                />

            </Card>

        </div>
    );
}

function ATSCheck({ completed, text }) {
    return (
        <div className="ats-check">

            <CheckCircleOutlined
                className={
                    completed
                        ? "check-success"
                        : "check-pending"
                }
            />

            <span>{text}</span>

            <Tag color={completed ? "green" : "orange"}>
                {completed ? "Complete" : "Missing"}
            </Tag>

        </div>
    );
}

// ======================================================
// JOB MATCHER
// ======================================================

function MatcherTab({
    jobDescription,
    setJobDescription,
    matchKeywords,
}) {
    const total =
        matchKeywords.matched.length +
        matchKeywords.missing.length;

    const matchPercentage =
        total === 0
            ? 0
            : Math.round(
                  (matchKeywords.matched.length /
                      total) *
                      100
              );

    return (
        <div className="matcher-panel">

            <Card title="Paste Job Description">

                <TextArea
                    rows={12}
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) =>
                        setJobDescription(
                            e.target.value
                        )
                    }
                />

            </Card>

            {jobDescription.trim() && (
                <Card title="Job Match">

                    <Progress
                        percent={matchPercentage}
                    />

                    <div className="keyword-section">

                        <Title level={5}>
                            Matched Keywords
                        </Title>

                        <Space wrap>
                            {matchKeywords.matched.map(
                                (keyword) => (
                                    <Tag
                                        color="green"
                                        key={keyword}
                                    >
                                        {keyword}
                                    </Tag>
                                )
                            )}
                        </Space>

                    </div>

                    <div className="keyword-section">

                        <Title level={5}>
                            Missing Keywords
                        </Title>

                        <Space wrap>
                            {matchKeywords.missing.map(
                                (keyword) => (
                                    <Tag
                                        color="red"
                                        key={keyword}
                                    >
                                        {keyword}
                                    </Tag>
                                )
                            )}
                        </Space>

                    </div>

                </Card>
            )}

        </div>
    );
}

// ======================================================
// RESUME PREVIEW
// ======================================================

function ResumePreview({ resume }) {
    return (
        <div className="resume-paper">

            <div className="resume-name">
                {resume.name || "Your Name"}
            </div>

            <div className="resume-role">
                {resume.role || "Your Target Role"}
            </div>

            <div className="resume-contact">

                {resume.email && (
                    <span>{resume.email}</span>
                )}

                {resume.phone && (
                    <span>{resume.phone}</span>
                )}

                {resume.location && (
                    <span>{resume.location}</span>
                )}

            </div>

            {(resume.linkedin ||
                resume.github) && (
                <div className="resume-links">

                    {resume.linkedin && (
                        <span>
                            {resume.linkedin}
                        </span>
                    )}

                    {resume.github && (
                        <span>
                            {resume.github}
                        </span>
                    )}

                </div>
            )}

            {resume.summary && (
                <ResumeSection
                    title="PROFESSIONAL SUMMARY"
                >
                    <p>{resume.summary}</p>
                </ResumeSection>
            )}

            {resume.skills && (
                <ResumeSection title="SKILLS">
                    <p>{resume.skills}</p>
                </ResumeSection>
            )}

            {resume.experience.some(
                (item) =>
                    item.company ||
                    item.role ||
                    item.description
            ) && (
                <ResumeSection title="EXPERIENCE">

                    {resume.experience.map(
                        (item, index) => (

                            <div
                                className="resume-entry"
                                key={index}
                            >

                                <div className="entry-header">

                                    <strong>
                                        {item.role}
                                    </strong>

                                    <span>
                                        {item.duration}
                                    </span>

                                </div>

                                <div className="company-name">
                                    {item.company}
                                </div>

                                <p>
                                    {item.description}
                                </p>

                            </div>

                        )
                    )}

                </ResumeSection>
            )}

            {resume.education.some(
                (item) =>
                    item.degree ||
                    item.college
            ) && (
                <ResumeSection title="EDUCATION">

                    {resume.education.map(
                        (item, index) => (

                            <div
                                className="resume-entry"
                                key={index}
                            >

                                <div className="entry-header">

                                    <strong>
                                        {item.degree}
                                    </strong>

                                    <span>
                                        {item.year}
                                    </span>

                                </div>

                                <div>
                                    {item.college}
                                </div>

                            </div>

                        )
                    )}

                </ResumeSection>
            )}

            {resume.projects.some(
                (item) =>
                    item.name ||
                    item.description
            ) && (
                <ResumeSection title="PROJECTS">

                    {resume.projects.map(
                        (item, index) => (

                            <div
                                className="resume-entry"
                                key={index}
                            >

                                <strong>
                                    {item.name}
                                </strong>

                                {item.technologies && (
                                    <div>
                                        <em>
                                            {item.technologies}
                                        </em>
                                    </div>
                                )}

                                <p>
                                    {item.description}
                                </p>

                            </div>

                        )
                    )}

                </ResumeSection>
            )}

            {resume.certifications && (
                <ResumeSection title="CERTIFICATIONS">
                    <p>{resume.certifications}</p>
                </ResumeSection>
            )}

        </div>
    );
}

function ResumeSection({ title, children }) {
    return (
        <section className="resume-preview-section">

            <h3>{title}</h3>

            <div>
                {children}
            </div>

        </section>
    );
}

export default ResumeMaker;