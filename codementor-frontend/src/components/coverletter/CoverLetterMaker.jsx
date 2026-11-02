import { useState } from "react";

import {
    Button,
    Card,
    Input,
    Typography,
    message,
    Tag,
    Divider,
    Space
} from "antd";

import {
    MailOutlined,
    RobotOutlined,
    FileTextOutlined,
    DownloadOutlined,
    ReloadOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";

import { generateCoverLetter } from "../../services/coverLetterApi";

import "../../styles/cover-letter.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

function CoverLetterMaker() {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",

        jobTitle: "",
        companyName: "",
        jobDescription: "",

        education: "",
        skills: "",
        experience: "",
        projects: "",
        achievements: "",

        tone: "Professional"
    });

    const [coverLetter, setCoverLetter] = useState("");

    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleGenerate = async () => {

        if (!form.fullName.trim()) {
            message.warning("Please enter your full name.");
            return;
        }

        if (!form.jobTitle.trim()) {
            message.warning("Please enter the target job title.");
            return;
        }

        if (!form.companyName.trim()) {
            message.warning("Please enter the company name.");
            return;
        }

        if (!form.jobDescription.trim()) {
            message.warning("Please enter the job description.");
            return;
        }

        setLoading(true);

        try {

            const result = await generateCoverLetter(form);

            setCoverLetter(result.coverLetter);

            message.success(
                "ATS-friendly cover letter generated successfully!"
            );

        } catch (error) {

            console.error(error);

            message.error(
                "Could not generate the cover letter. Please check your backend."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleClear = () => {

        setForm({
            fullName: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",

            jobTitle: "",
            companyName: "",
            jobDescription: "",

            education: "",
            skills: "",
            experience: "",
            projects: "",
            achievements: "",

            tone: "Professional"
        });

        setCoverLetter("");

        message.success("Cover letter form cleared.");
    };

    const handleDownload = () => {

        if (!coverLetter) {
            message.warning(
                "Please generate a cover letter first."
            );
            return;
        }

        window.print();
    };

    return (
        <div className="cover-letter-page">

            {/* PAGE HEADER */}

            <div className="cover-letter-header">

                <div>

                    <div className="cover-letter-title-row">

                        <div className="cover-letter-main-icon">
                            <MailOutlined />
                        </div>

                        <div>
                            <Title level={2}>
                                AI Cover Letter Maker
                            </Title>

                            <Text type="secondary">
                                Create professional and ATS-friendly
                                cover letters tailored to your target job.
                            </Text>
                        </div>

                    </div>

                </div>

                <Tag color="blue">
                    <RobotOutlined /> AI Powered
                </Tag>

            </div>


            {/* WORKSPACE */}

            <div className="cover-letter-workspace">


                {/* LEFT SIDE */}

                <div className="cover-letter-editor">


                    {/* PERSONAL INFORMATION */}

                    <Card
                        className="cover-card"
                        title={
                            <Space>
                                <FileTextOutlined />
                                Personal Information
                            </Space>
                        }
                    >

                        <div className="form-grid">

                            <Input
                                placeholder="Full Name *"
                                value={form.fullName}
                                onChange={(e) =>
                                    updateField(
                                        "fullName",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    updateField(
                                        "email",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Phone"
                                value={form.phone}
                                onChange={(e) =>
                                    updateField(
                                        "phone",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Location"
                                value={form.location}
                                onChange={(e) =>
                                    updateField(
                                        "location",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="LinkedIn URL"
                                value={form.linkedin}
                                onChange={(e) =>
                                    updateField(
                                        "linkedin",
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="GitHub / Portfolio"
                                value={form.github}
                                onChange={(e) =>
                                    updateField(
                                        "github",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </Card>


                    {/* JOB INFORMATION */}

                    <Card
                        className="cover-card"
                        title={
                            <Space>
                                <ThunderboltOutlined />
                                Target Job
                            </Space>
                        }
                    >

                        <Input
                            className="cover-input"
                            placeholder="Target Job Title *"
                            value={form.jobTitle}
                            onChange={(e) =>
                                updateField(
                                    "jobTitle",
                                    e.target.value
                                )
                            }
                        />

                        <Input
                            className="cover-input"
                            placeholder="Company Name *"
                            value={form.companyName}
                            onChange={(e) =>
                                updateField(
                                    "companyName",
                                    e.target.value
                                )
                            }
                        />

                        <TextArea
                            className="cover-input"
                            rows={7}
                            placeholder="Paste the complete Job Description *"
                            value={form.jobDescription}
                            onChange={(e) =>
                                updateField(
                                    "jobDescription",
                                    e.target.value
                                )
                            }
                        />

                    </Card>


                    {/* BACKGROUND */}

                    <Card
                        className="cover-card"
                        title="Your Background"
                    >

                        <TextArea
                            className="cover-input"
                            rows={4}
                            placeholder="Education / Degree"
                            value={form.education}
                            onChange={(e) =>
                                updateField(
                                    "education",
                                    e.target.value
                                )
                            }
                        />

                        <TextArea
                            className="cover-input"
                            rows={4}
                            placeholder="Skills (Java, Spring Boot, SQL, React...)"
                            value={form.skills}
                            onChange={(e) =>
                                updateField(
                                    "skills",
                                    e.target.value
                                )
                            }
                        />

                        <TextArea
                            className="cover-input"
                            rows={5}
                            placeholder="Work Experience"
                            value={form.experience}
                            onChange={(e) =>
                                updateField(
                                    "experience",
                                    e.target.value
                                )
                            }
                        />

                        <TextArea
                            className="cover-input"
                            rows={5}
                            placeholder="Projects"
                            value={form.projects}
                            onChange={(e) =>
                                updateField(
                                    "projects",
                                    e.target.value
                                )
                            }
                        />

                        <TextArea
                            className="cover-input"
                            rows={4}
                            placeholder="Achievements"
                            value={form.achievements}
                            onChange={(e) =>
                                updateField(
                                    "achievements",
                                    e.target.value
                                )
                            }
                        />

                    </Card>


                    {/* ACTION BUTTONS */}

                    <div className="cover-actions">

                        <Button
                            type="primary"
                            size="large"
                            icon={<RobotOutlined />}
                            loading={loading}
                            onClick={handleGenerate}
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Cover Letter"}
                        </Button>

                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="cover-letter-preview-area">

                    <div className="preview-topbar">

                        <div>
                            <Text strong>
                                Cover Letter Preview
                            </Text>

                            <br />

                            <Text type="secondary">
                                ATS-friendly format
                            </Text>
                        </div>

                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                        >
                            Download / Print
                        </Button>

                    </div>


                    {/* A4 PREVIEW */}

                    <div className="cover-letter-paper">

                        {coverLetter ? (

                            <div className="generated-letter">

                                <div className="letter-header">

                                    <h1>
                                        {form.fullName}
                                    </h1>

                                    <div className="contact-line">

                                        {form.email && (
                                            <span>
                                                {form.email}
                                            </span>
                                        )}

                                        {form.phone && (
                                            <span>
                                                {form.phone}
                                            </span>
                                        )}

                                        {form.location && (
                                            <span>
                                                {form.location}
                                            </span>
                                        )}

                                    </div>

                                    <div className="contact-line">

                                        {form.linkedin && (
                                            <span>
                                                {form.linkedin}
                                            </span>
                                        )}

                                        {form.github && (
                                            <span>
                                                {form.github}
                                            </span>
                                        )}

                                    </div>

                                </div>


                                <Divider />


                                <div className="letter-date">
                                    {new Date().toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        }
                                    )}
                                </div>


                                <p>
                                    Hiring Manager
                                </p>

                                <p>
                                    {form.companyName}
                                </p>


                                <p className="letter-subject">
                                    Subject: Application for{" "}
                                    {form.jobTitle}
                                </p>


                                <p>
                                    Dear Hiring Manager,
                                </p>


                                <div className="letter-content">

                                    {coverLetter
                                        .split("\n")
                                        .map((paragraph, index) => (

                                            paragraph.trim() ? (
                                                <p key={index}>
                                                    {paragraph}
                                                </p>
                                            ) : null

                                        ))}

                                </div>


                                <p>
                                    Sincerely,
                                </p>

                                <p>
                                    <strong>
                                        {form.fullName}
                                    </strong>
                                </p>

                            </div>

                        ) : (

                            <div className="empty-preview">

                                <MailOutlined />

                                <h2>
                                    Your Cover Letter
                                </h2>

                                <p>
                                    Fill in your details and job
                                    description, then click
                                    <strong>
                                        {" "}Generate Cover Letter
                                    </strong>.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CoverLetterMaker;